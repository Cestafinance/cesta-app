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

const JOEUSDTVaultAddr = "0x95921D21029751bF8F65Bb53442b69412C71FFE0"
const PNGUSDCVaultAddr = "0xcd799015fbe5AF106E4D4aDe29D5AF9918bfd318"
const LYDDAIVaultAddr = "0x469b5620675a9988c24cDd57B1E7136E162D6a53"

const JOEAddr = "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd"
const PNGAddr = "0x60781C2586D68229fde47564546784ab3fACA982"
const LYDAddr = "0x4C9B4E1AC6F24CdE3660D5E4Ef1eBF77C710C084"

const JOEUSDTAddr = "0x1643de2efB8e35374D796297a9f95f64C082a8ce"
const PNGUSDCAddr = "0xC33Ac18900b2f63DFb60B554B1F53Cd5b474d4cd"
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

        const JOEUSDTVault  = await getContract(web3, avaxVaultL1ABI, JOEUSDTVaultAddr)
        const PNGUSDCVault  = await getContract(web3, avaxVaultL1ABI, PNGUSDCVaultAddr)
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

        // JOE <-> USDC
        const JOEUSDTAmt = toBN((await balanceOf(JOEUSDTVault, strategy))).mul(sharePerc).div(oneEther)
        const JOEUSDTContract = await getContract(web3, PairABI, JOEUSDTAddr);
        const JOEReserve = (await getReserves(JOEUSDTContract))[0];
        const totalSupplyJOEUSDT = toBN(await totalSupply(JOEUSDTContract));
        const JOEAmt = toBN(JOEReserve).mul(JOEUSDTAmt).div(totalSupplyJOEUSDT)
        const USDCAmt = toBN((await getAmountsOut(joeRouter,JOEAmt, JOEAddr, USDCAddr))[1])
        const USDCAmtMin = USDCAmt.mul(amountOutMinPerc).div(denominator).toString()

        // PNG <-> USDT
        const PNGUSDCAmt = toBN((await balanceOf(PNGUSDCVault, strategy))).mul(sharePerc).div(oneEther)
        const PNGUSDCContract = await getContract(web3, PairABI, PNGUSDCAddr);
        const PNGReserve = (await getReserves(PNGUSDCContract))[0];
        const totalSupplyPNGUSDT = toBN(await totalSupply(PNGUSDCContract));
        const PNGAmt = toBN(PNGReserve).mul(PNGUSDCAmt).div(totalSupplyPNGUSDT)
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

        return [0, USDCAmtMin, USDTAmtMin, DAIAmtMin];
    }
}

export default CestaAXSWithdrawTokenMinPrice; 