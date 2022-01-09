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

const USDTAVAXVaultAddr = "0xC4029ad66AAe4DCF3F8A8C67F4000EAFE49E6d10"
const USDCAVAXVaultAddr = "0x3d78fDb997995f0bF7C5d881a758C45F1B706b80"
const DAIAVAXVaultAddr = "0x469b5620675a9988c24cDd57B1E7136E162D6a53"
const MIMAVAXVaultAddr = "0x8fFa3a48eC7D7Ad9b8740733deCFB9876d8849b3"

const USDTAddr = "0xc7198437980c041c805A1EDcbA50c1Ce5db95118"
const USDCAddr = "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664"
const DAIAddr = "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70"
const MIMAddr = "0x130966628846BFd36ff31a822705796e8cb8C18D"

const USDTAVAXAddr = "0x5Fc70cF6A4A858Cf4124013047e408367EBa1ace"
const USDCAVAXAddr = "0xbd918Ed441767fe7924e99F6a0E0B568ac1970D9"
const DAIAVAXAddr = "0x87Dee1cC9FFd464B79e058ba20387c1984aed86a"
const MIMAVAXAddr = "0x239aAE4AaBB5D60941D7DFFAeaFE8e063C63Ab25"

let amountOutMinPerc = 995

class CestaASAWithdrawTokenMinPrice {    
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

        const stableAvaxVault  = await getContract(web3, vaultABI, vault);
        const stableAvaxStrategy  = await getContract(web3, strategyABI, strategy);

        const USDTAVAXVault  = await getContract(web3, avaxVaultL1ABI, USDTAVAXVaultAddr)
        const USDCAVAXVault  = await getContract(web3, avaxVaultL1ABI, USDCAVAXVaultAddr)
        const MIMAVAXVault  = await getContract(web3, avaxVaultL1ABI, MIMAVAXVaultAddr)

        const joeRouter = await getContract(web3, RouterABI, joeRouterAddr);
        const pngRouter = await getContract(web3, RouterABI, pngRouterAddr);
        const lydRouter = await getContract(web3, RouterABI, lydRouterAddr);

         // Vault
        const allPoolInUSD = toBN(await getAllPoolInUSD(stableAvaxVault));
        const vaultTotalSupply = toBN(await totalSupply(stableAvaxVault));
        let withdrawAmt = (allPoolInUSD).mul(shareToWithdraw).div(vaultTotalSupply);
        
         // Strategy
        const oneEther = toWei(toBN(1), "ether");
        const sharePerc = withdrawAmt.mul(oneEther).div(allPoolInUSD);
        
        // USDT <-> AVAX, LYD
        const USDTAVAXAmt = toBN((await balanceOf(USDTAVAXVault, strategy))).mul(sharePerc).div(oneEther)
        const USDTAVAXContract = await getContract(web3, PairABI, USDTAVAXAddr);
        const WAVAXReserveLYD = (await getReserves(USDTAVAXContract))[0];
        const totalSupplyUSDTAVAX = toBN(await totalSupply(USDTAVAXContract));
        const WAVAXAmtLYD = toBN(WAVAXReserveLYD).mul(USDTAVAXAmt).div(totalSupplyUSDTAVAX)
        const USDTAmt = toBN((await getAmountsOut(lydRouter, WAVAXAmtLYD.toString(), WAVAXAddr, USDTAddr))[1])
        const USDTAmtMin = USDTAmt.mul(amountOutMinPerc).div(denominator).toString();

         // USDC <-> AVAX, PNG
        const USDCAVAXAmt = toBN((await balanceOf(USDCAVAXVault, strategy))).mul(sharePerc).div(oneEther)
        const USDCAVAXContract = await getContract(web3, PairABI, USDCAVAXAddr);
        const WAVAXReservePNG= (await getReserves(USDCAVAXContract))[1];
        const totalSupplyUSDCAVAX = toBN((await totalSupply(USDCAVAXContract)));
        const WAVAXAmtPNG = toBN(WAVAXReservePNG).mul(USDCAVAXAmt).div(totalSupplyUSDCAVAX)
        const USDCAmt = toBN((await getAmountsOut(pngRouter, WAVAXAmtPNG.toString(), WAVAXAddr, USDCAddr))[1])
        const USDCAmtMin = USDCAmt.mul(amountOutMinPerc).div(denominator).toString();

        // DAI <-> AVAX, JOE
        const MIMAVAXAmt = toBN((await balanceOf(MIMAVAXVault, strategy))).mul(sharePerc).div(oneEther)
        const MIMAVAXContract = await getContract(web3, PairABI, MIMAVAXAddr);
        const WAVAXReserveJOE = (await getReserves(MIMAVAXContract))[1]
        const totalSupplyMIMAVAX = toBN(await totalSupply(MIMAVAXContract))
        const WAVAXAmtJOE = toBN(WAVAXReserveJOE).mul(MIMAVAXAmt).div(totalSupplyMIMAVAX)
        const MIMAmt = toBN((await getAmountsOut(joeRouter, WAVAXAmtJOE.toString(), WAVAXAddr, MIMAddr))[1])
        const MIMAmtMin = MIMAmt.mul(amountOutMinPerc).div(denominator).toString()

        debugger;
        return [0, USDTAmtMin, USDCAmtMin, MIMAmtMin];
    }
}

export default CestaASAWithdrawTokenMinPrice; 