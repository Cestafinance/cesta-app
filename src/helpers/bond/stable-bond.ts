import { ContractInterface, ethers } from "ethers";
import { Bond, BondOpts } from "./bond";
import { BondType } from "./constants";
import { Networks } from "../../Constants/v2/blockchain";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { getAddresses } from "../../Constants/v2/addresses";
import { BigNumber } from "ethers";
import { getTokenPrice } from "../../helpers";
export interface StableBondOpts extends BondOpts {
    readonly reserveContractAbi: ContractInterface;
    readonly tokensInStrategy?: string;
}

export class StableBond extends Bond {
    readonly isLP = false;
    readonly reserveContractAbi: ContractInterface;
    readonly displayUnits: string;
    readonly tokensInStrategy?: string;

    constructor(stableBondOpts: StableBondOpts) {
        super(BondType.StableAsset, stableBondOpts);

        // For stable bonds the display units are the same as the actual token
        this.displayUnits = stableBondOpts.displayName;
        this.reserveContractAbi = stableBondOpts.reserveContractAbi;
        this.tokensInStrategy = stableBondOpts.tokensInStrategy;
    }

    public async getTreasuryBalance(networkID: Networks, provider: StaticJsonRpcProvider) {
        const addresses = getAddresses(networkID);
        const token = this.getContractForReserve(networkID, provider);
        let tokenAmount = await token.balanceOf(addresses.TREASURY_ADDRESS);
        if (this.tokensInStrategy) {
            tokenAmount = BigNumber.from(tokenAmount).add(BigNumber.from(this.tokensInStrategy)).toString();
        }
        return tokenAmount / Math.pow(10, 18);
    }

    public async getTokenAmount(networkID: Networks, provider: StaticJsonRpcProvider) {
        return this.getTreasuryBalance(networkID, provider);
    }

    public getTimeAmount(networkID: Networks, provider: StaticJsonRpcProvider) {
        return new Promise<number>(reserve => reserve(0));
    }

    public async getMaxBondPrice(networkID: Networks, provider: StaticJsonRpcProvider, value: string = "0"): Promise<any> {
        let maxBondPriceToken = 0;
        const maxBodValue = ethers.utils.parseUnits("1");

        let bondQuote = 0;
        let maxBondQuote = 0;
        let maxBondPrice = 0;

        const amountInWei = ethers.utils.parseEther(value);

        try {
            const bondContract = super.getContractForBond(networkID, provider);
            maxBondPrice = (await bondContract.maxPayout()) / Math.pow(10, 9);
            
            bondQuote = await bondContract.payoutFor(amountInWei);
            bondQuote = bondQuote / Math.pow(10, 18);

            maxBondQuote = await bondContract.payoutFor(maxBodValue);
            maxBondPriceToken = maxBondPrice / (maxBondQuote * Math.pow(10, -18));

        } catch(err) {
            console.error(`Error in getMaxBondPrice(): `, err);
        } finally { 
            return {
                bondQuote,
                maxBondPrice,
                maxBondPriceToken
            }
        }
    }

    public async getPurchasedAmount(networkID: Networks, provider: StaticJsonRpcProvider): Promise<any> {
        let purchased = 0;
        try {
            const addresses = getAddresses(networkID);

            const token = super.getContractForReserve(networkID, provider);
            purchased = await token.balanceOf(addresses.TREASURY_ADDRESS);

            if (this.tokensInStrategy) {
                purchased = Number(BigNumber.from(purchased).add(BigNumber.from(this.tokensInStrategy)).toString());
            }
            purchased = purchased / Math.pow(10, 18);
    
            // if (this.name === wavax.name) {
            //     const avaxPrice = getTokenPrice("AVAX");
            //     purchased = purchased * avaxPrice;
            // }
        } catch(err) {
            console.error(`Error in getPurchasedAmount(): `, err);
        } finally {
            return purchased;
        }
    } 
}

// These are special bonds that have different valuation methods
export interface CustomBondOpts extends StableBondOpts {}

export class CustomBond extends StableBond {
    constructor(customBondOpts: CustomBondOpts) {
        super(customBondOpts);

        this.getTreasuryBalance = async (networkID: Networks, provider: StaticJsonRpcProvider) => {
            const tokenAmount = await super.getTreasuryBalance(networkID, provider);
            const tokenPrice = this.getTokenPrice();

            return tokenAmount * tokenPrice;
        };
    }
}
