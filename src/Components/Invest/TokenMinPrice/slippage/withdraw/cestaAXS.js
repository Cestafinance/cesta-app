import RouterABI from "../../../../../assets/abis/router-abi.json";
import avaxVaultL1ABI from "../../../../../assets/abis/avaxVaultL1-abi.json";
import PairABI from "../../../../../assets/abis/pair-abi.json";

import {
    getContract,
    getAmountsOut,
    getAllPoolInUSD,
    totalSupply,
    balanceOf,
    getReserves
} from "../util";
import { toWei, toBN } from "web3-utils";

const joeRouterAddr = "0x60aE616a2155Ee3d9A68541Ba4544862310933d4"
const pngRouterAddr = "0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106"
const lydRouterAddr = "0xA52aBE4676dbfd04Df42eF7755F01A3c41f28D27"

const JOEUSDCVaultAddr = "0xC4029ad66AAe4DCF3F8A8C67F4000EAFE49E6d10"
const PNGUSDTVaultAddr = "0x3d78fDb997995f0bF7C5d881a758C45F1B706b80"
const LYDDAIVaultAddr = "0x469b5620675a9988c24cDd57B1E7136E162D6a53"

const JOEAddr = "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd"
const PNGAddr = "0x60781C2586D68229fde47564546784ab3fACA982"
const LYDAddr = "0x4C9B4E1AC6F24CdE3660D5E4Ef1eBF77C710C084"

const JOEUSDCAddr = "0x67926d973cD8eE876aD210fAaf7DFfA99E414aCf"
const PNGUSDTAddr = "0x1fFB6ffC629f5D820DCf578409c2d26A2998a140"
const LYDDAIAddr = "0x4EE072c5946B4cdc00CBdeB4A4E54A03CF6d08d3"

const USDTAddr = "0xc7198437980c041c805A1EDcbA50c1Ce5db95118"
const USDCAddr = "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664"
const DAIAddr = "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70"

let amountOutMinPerc = 995

class CestaAXSWithdrawTokenMinPrice {    
    static getAmountsOut = async(object) => {
        let {
            web3,
            shareToWithdraw, 
            strategy,
            strategyABI,
            vault,
            vaultABI
        } = object;

        // Convert withdraw amount to big number
        shareToWithdraw = toBN(shareToWithdraw);
        amountOutMinPerc = toBN(amountOutMinPerc);
        const denominator = toBN(1000);

        const deXStableVault  = await getContract(web3, vaultABI, vault);

        const JOEUSDCVault  = await getContract(web3, avaxVaultL1ABI, JOEUSDCVaultAddr)
        const PNGUSDTVault  = await getContract(web3, avaxVaultL1ABI, PNGUSDTVaultAddr)
        const LYDDAIVault  = await getContract(web3, avaxVaultL1ABI, LYDDAIVaultAddr)

        const joeRouter = await getContract(web3,RouterABI, joeRouterAddr);
        const pngRouter = await getContract(web3,RouterABI, pngRouterAddr);
        const lydRouter = await getContract(web3,RouterABI, lydRouterAddr);

         // Vault

        const allPoolInUSD = toBN(await getAllPoolInUSD(deXStableVault));
        const vaultTotalSupply = toBN(await totalSupply(deXStableVault));
        let withdrawAmt = (allPoolInUSD).mul(shareToWithdraw).div(vaultTotalSupply);

        // Strategy
        const oneEther = toWei(toBN(1), "ether");
        const sharePerc = withdrawAmt.mul(oneEther).div(allPoolInUSD);

        debugger;

        // JOE <-> USDC
        const JOEUSDCAmt = toBN((await balanceOf(JOEUSDCVault, strategy))).mul(sharePerc).div(oneEther)
        const JOEUSDCContract = await getContract(web3, PairABI, JOEUSDCAddr);
        const JOEReserve = (await getReserves(JOEUSDCContract))[0];
        const totalSupplyJOEUSDC = toBN(await totalSupply(JOEUSDCContract));
        const JOEAmt = toBN(JOEReserve).mul(JOEUSDCAmt).div(totalSupplyJOEUSDC)
        const USDCAmt = toBN((await getAmountsOut(joeRouter,JOEAmt, JOEAddr, USDCAddr))[1])
        const USDCAmtMin = USDCAmt.mul(amountOutMinPerc).div(denominator).toString()

        // PNG <-> USDT
        const PNGUSDTAmt = toBN((await balanceOf(PNGUSDTVault, strategy))).mul(sharePerc).div(oneEther)
        const PNGUSDTContract = await getContract(web3, PairABI, PNGUSDTAddr);
        const PNGReserve = (await getReserves(PNGUSDTContract))[0];
        const totalSupplyPNGUSDT = toBN(await totalSupply(PNGUSDTContract));
        const PNGAmt = toBN(PNGReserve).mul(PNGUSDTAmt).div(totalSupplyPNGUSDT)
        const USDTAmt = toBN((await getAmountsOut(pngRouter, PNGAmt, PNGAddr, USDTAddr))[1])
        const USDTAmtMin = USDTAmt.mul(amountOutMinPerc).div(denominator).toString()

        // LYD
        const LYDDAIAmt = toBN((await balanceOf(LYDDAIVault, strategy))).mul(sharePerc).div(oneEther)
        const LYDDAIContract = await getContract(web3, PairABI, LYDDAIAddr)
        const LYDReserve = (await getReserves(LYDDAIContract))[0];
        const totalSupplyLYDDAI = toBN(await totalSupply(LYDDAIContract));
        const LYDAmt = toBN(LYDReserve).mul(LYDDAIAmt).div(totalSupplyLYDDAI)
        const DAIAmt = toBN((await getAmountsOut( lydRouter,LYDAmt, LYDAddr, DAIAddr))[1])
        const DAIAmtMin = DAIAmt.mul(amountOutMinPerc).div(denominator).toString();

        debugger;

        return [0, USDCAmtMin, USDTAmtMin, DAIAmtMin];
    }
}

export default CestaAXSWithdrawTokenMinPrice; 