import { ContractInterface, ethers } from "ethers";
import { Bond, BondOpts } from "./bond";
import { BondType } from "./constants";
import { Networks } from "../../Constants/v2/blockchain";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { getBondCalculator } from "../bond-calculator";
import { getAddresses } from "../../Constants/v2/addresses";
import { getTokenPrice } from "../../helpers";

// Keep all LP specific fields/logic within the LPBond class
export interface LPBondOpts extends BondOpts {
    readonly reserveContractAbi: ContractInterface;
    readonly lpUrl: string;
}

export class LPBond extends Bond {
    readonly isLP = true;
    readonly lpUrl: string;
    readonly reserveContractAbi: ContractInterface;
    readonly displayUnits: string;

    constructor(lpBondOpts: LPBondOpts) {
        super(BondType.LP, lpBondOpts);

        this.lpUrl = lpBondOpts.lpUrl;
        this.reserveContractAbi = lpBondOpts.reserveContractAbi;
        this.displayUnits = "LP";
    }

    async getTreasuryBalance(networkID: Networks, provider: StaticJsonRpcProvider) {
        const addresses = getAddresses(networkID);

        const token = this.getContractForReserve(networkID, provider);
        const tokenAddress = this.getAddressForReserve(networkID);
        const bondCalculator = getBondCalculator(networkID, provider);
        const tokenAmount = await token.balanceOf(addresses.TREASURY_ADDRESS);
        const valuation = await bondCalculator.valuation(tokenAddress, tokenAmount);
        const markdown = await bondCalculator.markdown(tokenAddress);
        const tokenUSD = (valuation / Math.pow(10, 9)) * (markdown / Math.pow(10, 18));

        return tokenUSD;
    }

    public getTokenAmount(networkID: Networks, provider: StaticJsonRpcProvider) {
        return this.getReserves(networkID, provider, true);
    }

    public getTimeAmount(networkID: Networks, provider: StaticJsonRpcProvider) {
        return this.getReserves(networkID, provider, false);
    }

    private async getReserves(networkID: Networks, provider: StaticJsonRpcProvider, isToken: boolean): Promise<number> {
        const addresses = getAddresses(networkID);

        const token = this.getContractForReserve(networkID, provider);

        let [reserve0, reserve1] = await token.getReserves();
        const token1: string = await token.token1();
        const isCesta = token1.toLowerCase() === addresses.CESTA_ADDRESS.toLowerCase();

        return isToken ? this.toTokenDecimal(false, isCesta ? reserve0 : reserve1) : this.toTokenDecimal(true, isCesta ? reserve1 : reserve0);
    }

    private toTokenDecimal(isCesta: boolean, reserve: number) {
        return isCesta ? reserve / Math.pow(10, 9) : reserve / Math.pow(10, 18);
    }

    public async getMaxBondPrice(networkID: Networks, provider: StaticJsonRpcProvider, value: string = "0"): Promise<any> {
        let maxBondPriceToken = 0;
        const maxBodValue = ethers.utils.parseUnits("1");

        let bondQuote = 0;
        let valuation = 0
        let maxBondQuote = 0;
        let maxBondPrice = 0;

        const amountInWei = ethers.utils.parseEther(value);

        try {
            const bondContract = super.getContractForBond(networkID, provider);
            const bondCalcContract = super.getContractForBond(networkID, provider);

            maxBondPrice = (await bondContract.maxPayout()) / Math.pow(10, 9);
            valuation = (await bondCalcContract.valuation(super.getAddressForReserve(networkID), amountInWei));
            bondQuote = await bondContract.payoutFor(valuation);
            bondQuote = bondQuote / Math.pow(10, 9);

            const maxValuation = await bondCalcContract.valuation(super.getAddressForReserve(networkID), maxBodValue);
            maxBondQuote = await bondContract.payoutFor(maxValuation);
            maxBondPriceToken = maxBondPrice / (maxBondQuote * Math.pow(10, -9));

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

            const assetAddress = super.getAddressForReserve(networkID);
            const bondCalcContract = super.getContractForBond(networkID, provider);

            const markdown = await bondCalcContract.markdown(assetAddress);

            purchased = await bondCalcContract.valuation(assetAddress, purchased);
            purchased = (markdown / Math.pow(10, 18)) * (purchased / Math.pow(10, 9));

            // if (this.name === avaxTime.name) {
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
export interface CustomLPBondOpts extends LPBondOpts {}

export class CustomLPBond extends LPBond {
    constructor(customBondOpts: CustomLPBondOpts) {
        super(customBondOpts);

        this.getTreasuryBalance = async (networkID: Networks, provider: StaticJsonRpcProvider) => {
            const tokenAmount = await super.getTreasuryBalance(networkID, provider);
            const tokenPrice = this.getTokenPrice();

            return tokenAmount * tokenPrice;
        };

        this.getTokenAmount = async (networkID: Networks, provider: StaticJsonRpcProvider) => {
            const tokenAmount = await super.getTokenAmount(networkID, provider);
            const tokenPrice = this.getTokenPrice();

            return tokenAmount * tokenPrice;
        };
    }
}
