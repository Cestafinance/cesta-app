import { ethers, constants } from "ethers";
import { getMarketPrice, getTokenPrice } from "../../helpers";
import { calculateUserBondDetails, getBalances } from "./account-slice";
import { getAddresses } from "../../Constants/v2";
import { fetchPendingTxns, clearPendingTxn } from "./pending-txns-slice";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { fetchAccountSuccess } from "./account-slice";
import { Bond } from "../../helpers/bond/bond";
import { Networks } from "../../Constants/v2/blockchain";
import { getBondCalculator } from "../../helpers/bond-calculator";
import { avaxTime, wavax } from "../../helpers/bond";
import { error, warning, success, info } from "../slices/messages-slice";
import { messages } from "../../Constants/v2/messages";
import { getGasPrice } from "../../helpers/get-gas-price";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";
import { sleep } from "../../helpers";
import { BigNumber } from "ethers";
import { transactionCompleted, transactionError, transactionInitiated, transactionSuccess } from "./txn-slice";

interface IChangeApproval {
    bond: Bond;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
    address: string;
}

// Store bond list fetched from API
export const storeBonds = createAsyncThunk("bonding/list", async(bondList: Bond[]) => {
    return { bondList };
})

export const changeApproval = createAsyncThunk("bonding/changeApproval", async ({ bond, provider, networkID, address }: IChangeApproval, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }

    const signer = provider.getSigner();
    const reserveContract = bond.getContractForReserve(networkID, signer);

    let approveTx;
    try {
        const gasPrice = await getGasPrice(provider);
        const bondAddr = bond.getAddressForBond(networkID);
        approveTx = await reserveContract.approve(bondAddr, constants.MaxUint256, { gasPrice });
        dispatch(
            fetchPendingTxns({
                txnHash: approveTx.hash,
                text: "Approving " + bond.displayName,
                type: "approve_" + bond.name,
            }),
        );

        // For bondTransaction state
        dispatch(transactionInitiated({
            txnHash: approveTx.hash,
            type: "approve"
        }))

        await approveTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
        dispatch(transactionSuccess());
    
    } catch (err: any) {
        metamaskErrorWrap(err, dispatch);
        dispatch(transactionError({ type: 'approve' }));
    } finally {
        if (approveTx) {
            dispatch(clearPendingTxn(approveTx.hash));
        }
        
        setTimeout(() => {
            dispatch(transactionCompleted());
        }, 2000);
    }

    await sleep(2);

    let allowance = "0";

    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID));

    return dispatch(
        fetchAccountSuccess({
            bonds: {
                [bond.name]: {
                    allowance: Number(allowance),
                },
            },
        }),
    );
});

interface ICalcBondDetails {
    bond: Bond;
    value: string | null;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

export interface IBondDetails {
    bond: string;
    bondDiscount: number;
    bondQuote: number;
    purchased: number;
    vestingTerm: number;
    maxBondPrice: number;
    bondPrice: number;
    marketPrice: number;
    maxBondPriceToken: number;
}

export const calcBondDetails = createAsyncThunk("bonding/calcBondDetails", async ({ bond, value, provider, networkID }: ICalcBondDetails, { dispatch }) => {
    if (!value) {
        value = "0";
    }

    const bondContract = bond.getContractForBond(networkID, provider);
    const terms = await bondContract.terms();
   
    // Getting price for CESTA <-> MIM pair
    let marketPrice = await getMarketPrice(networkID, provider);
    const mimPrice = getTokenPrice("MIM");
    marketPrice = marketPrice * mimPrice;

    // Calculate bond discount
    let {bondDiscount, bondPrice} = await bond.getBondDiscount(networkID, provider, marketPrice);

    // Calculate bonds purchased
    let purchased = await bond.getPurchasedAmount(networkID, provider);

    // Getting bond quote, max bond price and max bond price token
    // const { bondQuote, maxBondPrice, maxBondPriceToken } = await bond.getMaxBondPrice(networkID, provider, value);
    // if (!!value && bondQuote > maxBondPrice) {
    //     dispatch(error({ text: messages.try_mint_more(maxBondPrice.toFixed(2).toString()) }));
    // }

    return {
        bond: bond.name,
        vestingTerm: Number(terms.vestingTerm),
        marketPrice,
        bondDiscount,
        bondPrice: bondPrice / Math.pow(10, 18),
        purchased,
        // bondQuote,
        // maxBondPrice,
        // maxBondPriceToken,
    };
});

export interface IBondAppDetails {
    marketPrice: number,
    treasuryBalance: number,
}
interface ICalcBondAppDetails {
    bonds: Bond[];
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

export const loadBondAppDetail = createAsyncThunk("bonding/appDetail", async({ bonds, provider, networkID}: ICalcBondAppDetails) => {
    try {
          // CESTA price
        let marketPrice = await getMarketPrice(networkID, provider);
        const mimPrice = getTokenPrice("MIM");
        // marketPrice = (marketPrice / Math.pow(10, 9)) * mimPrice;
        // TODO: Market price need to divide by Math.pow(10, 9) ? 
        marketPrice = marketPrice * mimPrice; 

        // Treasury Balance
        const tokenBalPromises = bonds.map(bond => bond.getTreasuryBalance(networkID, provider));
        const tokenBalances = await Promise.all(tokenBalPromises);
        const treasuryBalance = tokenBalances.reduce((tokenBalance0, tokenBalance1) => tokenBalance0 + tokenBalance1, 0);

        return {
            treasuryBalance, 
            marketPrice
        }
    } catch(err) {
        console.error(`Error in loadBondAppDetail(): `, err)
    }
})

interface IBondAsset {
    value: string;
    address: string;
    bond: Bond;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    slippage: number;
    useAvax: boolean;
}
export const bondAsset = createAsyncThunk("bonding/bondAsset", async ({ value, address, bond, networkID, provider, slippage, useAvax }: IBondAsset, { dispatch }) => {
    const depositorAddress = address;
    const acceptedSlippage = slippage / 100 || 0.005;
    const valueInWei = ethers.utils.parseUnits(value, "ether");
    const signer = provider.getSigner();
    const bondContract = bond.getContractForBond(networkID, signer);

    const calculatePremium = await bondContract.bondPrice();
    const maxPremium = Math.round(calculatePremium * (1 + acceptedSlippage));

    let bondTx;
    try {
        const gasPrice = await getGasPrice(provider);

        if (useAvax) {
            bondTx = await bondContract.deposit(valueInWei, maxPremium.toString(), depositorAddress, { value: valueInWei, gasPrice });
        } else {
            bondTx = await bondContract.deposit(valueInWei, maxPremium.toString(), depositorAddress, { gasPrice });
        }

        dispatch(
            fetchPendingTxns({
                txnHash: bondTx.hash,
                text: "Bonding " + bond.displayName,
                type: "bond_" + bond.name,
            }),
        );
        dispatch(transactionInitiated({
            txnHash: bondTx.hash,
            type: "bond"
        }))

        await bondTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
        dispatch(transactionSuccess());
        dispatch(info({ text: messages.your_balance_update_soon }));

        await sleep(10);
        await dispatch(calculateUserBondDetails({ address, bond, networkID, provider }));
        dispatch(info({ text: messages.your_balance_updated }));

        return;
    } catch (err: any) {
        console.error(`bond deposit error`, err);
        dispatch(transactionError({ type: 'bond' }));
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (bondTx) {
            dispatch(clearPendingTxn(bondTx.hash));
        }

        setTimeout(() => {
            dispatch(transactionCompleted());
        }, 2000);
    }
});

interface IRedeemBond {
    address: string;
    bond: Bond;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    autostake: boolean;
}

export const redeemBond = createAsyncThunk("bonding/redeemBond", async ({ address, bond, networkID, provider, autostake }: IRedeemBond, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }

    const signer = provider.getSigner();
    const bondContract = bond.getContractForBond(networkID, signer);

    let redeemTx;
    try {
        const gasPrice = await getGasPrice(provider);

        redeemTx = await bondContract.redeem(address, autostake === true, { gasPrice });
        const pendingTxnType = "redeem_bond_" + bond.name + (autostake === true ? "_autostake" : "");
        dispatch(
            fetchPendingTxns({
                txnHash: redeemTx.hash,
                text: "Redeeming " + bond.displayName,
                type: pendingTxnType,
            }),
        );
        dispatch(transactionInitiated({
            txnHash: redeemTx.hash,
            type: autostake ? 'redeem_autostake' : "redeem"
        }))

        await redeemTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
        dispatch(transactionSuccess());
        await sleep(0.01);
        dispatch(info({ text: messages.your_balance_update_soon }));

        await sleep(10);
        await dispatch(calculateUserBondDetails({ address, bond, networkID, provider }));
        await dispatch(getBalances({ address, networkID, provider }));
        dispatch(info({ text: messages.your_balance_updated }));
        
        return;
    } catch (err: any) {
        metamaskErrorWrap(err, dispatch);
        dispatch(transactionError({ type: autostake ? 'redeem_autostake' : "redeem" }));
    } finally {
        if (redeemTx) {
            dispatch(clearPendingTxn(redeemTx.hash));
        }

        setTimeout(() => {
            dispatch(transactionCompleted());
        }, 2000);
    }
});

export interface IBondSlice {
    loading: boolean;
    [key: string]: any;
}

const initialState: IBondSlice = {
    loading: true,
    appLoading: true
};

const setBondState = (state: IBondSlice, payload: any) => {
    const bond = payload.bond;
    const newState = { ...state[bond], ...payload };
    state[bond] = newState;
    state.loading = false;
};

const bondingSlice = createSlice({
    name: "bonding",
    initialState,
    reducers: {
        fetchBondSuccess(state, action) {
            state[action.payload.bond] = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(calcBondDetails.pending, state => {
                state.loading = true;
            })
            .addCase(calcBondDetails.fulfilled, (state, action) => {
                setBondState(state, action.payload);
                state.loading = false;
            })
            .addCase(calcBondDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(storeBonds.fulfilled, (state, action) => {
                const { bondList } = action.payload;
                state.bonds = bondList;
            })
            .addCase(loadBondAppDetail.pending, (state, action) => {
                state.appLoading = true;
            })
            .addCase(loadBondAppDetail.rejected, (state, action) => {
                state.appLoading = false;
            })
            .addCase(loadBondAppDetail.fulfilled, (state, action) => {
                state.app = action.payload;
                state.appLoading = false;
            })
    },
});

export default bondingSlice.reducer;

export const { fetchBondSuccess } = bondingSlice.actions;

const baseInfo = (state: any) => state.bonding;

export const getBondingState = createSelector(baseInfo, bonding => bonding);
