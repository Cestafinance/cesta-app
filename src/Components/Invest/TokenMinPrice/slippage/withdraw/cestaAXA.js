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

const WAVAXAddr = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7"

const joeRouterAddr = "0x60aE616a2155Ee3d9A68541Ba4544862310933d4"
const pngRouterAddr = "0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106"
const lydRouterAddr = "0xA52aBE4676dbfd04Df42eF7755F01A3c41f28D27"

const JOEAVAXVaultAddr = "0xFe67a4BAe72963BE1181B211180d8e617B5a8dee"
const PNGAVAXVaultAddr = "0x7eEcFB07b7677aa0e1798a4426b338dA23f9De34"
const LYDAVAXVaultAddr = "0xffEaB42879038920A31911f3E93295bF703082ed"

const JOEAddr = "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd"
const PNGAddr = "0x60781C2586D68229fde47564546784ab3fACA982"
const LYDAddr = "0x4C9B4E1AC6F24CdE3660D5E4Ef1eBF77C710C084"

const JOEAVAXAddr = "0x454E67025631C065d3cFAD6d71E6892f74487a15"
const PNGAVAXAddr = "0xd7538cABBf8605BdE1f4901B47B8D42c61DE0367"
const LYDAVAXAddr = "0xFba4EdaAd3248B03f1a3261ad06Ad846A8e50765"

let amountOutMinPerc = 995

class CestaAXAWithdrawTokenMinPrice {    
    static getAmountsOut = async(object) => {
        let {
            web3,
            shareToWithdraw, 
            stablecoinAddr, 
            strategy,
            strategyABI,
            vault,
            vaultABI
        } = object;

        // Convert withdraw amount to big number
        shareToWithdraw = toBN(shareToWithdraw);
        amountOutMinPerc = toBN(amountOutMinPerc);
        const denominator = toBN(1000);

        const deXAvaxVault = await getContract(web3, vaultABI, vault);
        const deXAvaxStrategy = await getContract(web3, strategyABI, strategy);

        const JOEAVAXVault = await getContract(web3, avaxVaultL1ABI, JOEAVAXVaultAddr)
        const PNGAVAXVault = await getContract(web3, avaxVaultL1ABI, PNGAVAXVaultAddr)
        const LYDAVAXVault = await getContract(web3, avaxVaultL1ABI, LYDAVAXVaultAddr)

        const joeRouter = await getContract(web3, RouterABI, joeRouterAddr);
        const pngRouter = await getContract(web3, RouterABI, pngRouterAddr);
        const lydRouter = await getContract(web3, RouterABI, lydRouterAddr);

         // Vault
        const allPoolInUSD = toBN(await getAllPoolInUSD(deXAvaxVault));
        const vaultTotalSupply = toBN(await totalSupply(deXAvaxVault));
        let withdrawAmt = (allPoolInUSD).mul(shareToWithdraw).div(vaultTotalSupply);

         // Strategy
        const oneEther = toWei(toBN(1) ,"ether");
        const sharePerc = withdrawAmt.mul(oneEther).div(allPoolInUSD);

        let totalWAVAXAmt = toBN(0);

        // JOE <-> AVAX
        const JOEAVAXAmt = toBN((await balanceOf(JOEAVAXVault, strategy))).mul(sharePerc).div(oneEther)
        const JOEAVAXContract = await getContract(web3, PairABI, JOEAVAXAddr);
        let reserve = await getReserves(JOEAVAXContract);
        let JOEReserve = toBN(reserve[0]);
        let WAVAXReserveJOE = toBN(reserve[1]);
        const totalSupplyJOEAVAX = toBN(await totalSupply(JOEAVAXContract));
        const JOEAmt = JOEReserve.mul(JOEAVAXAmt).div(totalSupplyJOEAVAX)
        const WAVAXAmtJOE = WAVAXReserveJOE.mul(JOEAVAXAmt).div(totalSupplyJOEAVAX)
        const _WAVAXAmtJOE = toBN((await getAmountsOut(joeRouter, JOEAmt.toString(), JOEAddr, WAVAXAddr))[1])
        const WAVAXAmtMinJOE = _WAVAXAmtJOE.mul(amountOutMinPerc).div(denominator)
        totalWAVAXAmt = totalWAVAXAmt.add(WAVAXAmtJOE).add(_WAVAXAmtJOE)

        // PNG <-> AVAX
        const PNGAVAXAmt = toBN((await balanceOf(PNGAVAXVault, strategy))).mul(sharePerc).div(oneEther)
        const PNGAVAXContract = await getContract(web3, PairABI, PNGAVAXAddr);
        let reserve2 = await getReserves(PNGAVAXContract);
        let PNGReserve = toBN(reserve2[0]);
        let WAVAXReservePNG = toBN(reserve2[1]);
        WAVAXReservePNG = toBN(WAVAXReservePNG);
        const totalSupplyPNGAVAX = toBN(await totalSupply(PNGAVAXContract));
        const PNGAmt = PNGReserve.mul(PNGAVAXAmt).div(totalSupplyPNGAVAX)
        const WAVAXAmtPNG = WAVAXReservePNG.mul(PNGAVAXAmt).div(totalSupplyPNGAVAX)
        const _WAVAXAmtPNG = toBN((await getAmountsOut(pngRouter, PNGAmt.toString(), PNGAddr, WAVAXAddr))[1])
        const WAVAXAmtMinPNG = _WAVAXAmtPNG.mul(amountOutMinPerc).div(denominator)
        totalWAVAXAmt = totalWAVAXAmt.add(WAVAXAmtPNG).add(_WAVAXAmtPNG)

        // LYD <-> AVAX
        const LYDAVAXAmt = toBN((await balanceOf(LYDAVAXVault, strategy))).mul(sharePerc).div(oneEther)
        const LYDAVAXContract = await await getContract(web3, PairABI, LYDAVAXAddr);
        let reserve3 = await getReserves(LYDAVAXContract);
        let LYDReserve = toBN(reserve3[0]);
        let WAVAXReserveLYD = toBN(reserve3[1]);
        WAVAXReserveLYD = toBN(WAVAXReserveLYD);
        const totalSupplyLYDAVAX = toBN(await totalSupply(LYDAVAXContract));
        const LYDAmt = LYDReserve.mul(LYDAVAXAmt).div(totalSupplyLYDAVAX)
        const WAVAXAmtLYD = WAVAXReserveLYD.mul(LYDAVAXAmt).div(totalSupplyLYDAVAX)
        const _WAVAXAmtLYD = toBN((await getAmountsOut(lydRouter, LYDAmt, LYDAddr, WAVAXAddr))[1])
        const WAVAXAmtMinLYD = _WAVAXAmtLYD.mul(amountOutMinPerc).div(denominator)
        totalWAVAXAmt = totalWAVAXAmt.add(WAVAXAmtLYD).add(_WAVAXAmtLYD)

        // Vault
        withdrawAmt = toBN((await getAmountsOut(joeRouter, totalWAVAXAmt, WAVAXAddr, stablecoinAddr))[1])
        const withdrawAmtMin = withdrawAmt.mul(amountOutMinPerc).div(denominator)
        
        return [withdrawAmtMin.toString(), WAVAXAmtMinJOE.toString(), WAVAXAmtMinPNG.toString(), WAVAXAmtMinLYD.toString()]
    }
}

export default CestaAXAWithdrawTokenMinPrice; 