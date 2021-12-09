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

const USDTAddr = "0xc7198437980c041c805A1EDcbA50c1Ce5db95118"
const USDCAddr = "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664"
const DAIAddr = "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70"

const USDTAVAXAddr = "0x67926d973cD8eE876aD210fAaf7DFfA99E414aCf"
const USDCAVAXAddr = "0x1fFB6ffC629f5D820DCf578409c2d26A2998a140"
const DAIAVAXAddr = "0x4EE072c5946B4cdc00CBdeB4A4E54A03CF6d08d3"

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
        const DAIAVAXVault  = await getContract(web3, avaxVaultL1ABI, DAIAVAXVaultAddr)

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
        const DAIAVAXAmt = toBN((await balanceOf(DAIAVAXVault, strategy))).mul(sharePerc).div(oneEther)
        const DAIAVAXContract = await getContract(web3, PairABI, DAIAVAXAddr);
        const WAVAXReserveJOE = (await getReserves(DAIAVAXContract))[1]
        const totalSupplyDAIAVAX = toBN(await totalSupply(DAIAVAXContract))
        const WAVAXAmtJOE = toBN(WAVAXReserveJOE).mul(DAIAVAXAmt).div(totalSupplyDAIAVAX)
        const DAIAmt = toBN((await getAmountsOut(joeRouter, WAVAXAmtJOE.toString(), WAVAXAddr, DAIAddr))[1])
        const DAIAmtMin = DAIAmt.mul(amountOutMinPerc).div(denominator).toString()

        debugger;
        return [0, USDTAmtMin, USDCAmtMin, DAIAmtMin];
    }
}

export default CestaASAWithdrawTokenMinPrice; 