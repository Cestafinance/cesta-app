import RouterABI from "../../../../../assets/abis/router-abi.json";
import {
    getContract,
    getAmountsOut,
} from "../util";
import { toWei, toBN } from 'web3-utils';

const USDTAddr = "0xc7198437980c041c805A1EDcbA50c1Ce5db95118"
const USDCAddr = "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664"
const DAIAddr = "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70"
const MIMAddr = "0x130966628846BFd36ff31a822705796e8cb8C18D"
const WAVAXAddr = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7"

const joeRouterAddr = "0x60aE616a2155Ee3d9A68541Ba4544862310933d4"
const pngRouterAddr = "0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106"
const lydRouterAddr = "0xA52aBE4676dbfd04Df42eF7755F01A3c41f28D27"


let amountOutMinPerc = 995;

class CestaASADepositTokenMinPrice {    
    static getAmountsOut = async(object) => {
        let {
            web3,
            amountDeposit, 
            stablecoinAddr, 
            strategy,
            strategyABI
        } = object;
        // Convert amount deposit to big number
        amountDeposit = toBN(amountDeposit);
        amountOutMinPerc = toBN(amountOutMinPerc);
        const denominator = toBN(1000);

        const stableAvaxStrategy  = await getContract(web3,strategyABI, strategy);

        const joeRouter = await getContract(web3,RouterABI, joeRouterAddr);
        const pngRouter = await getContract(web3,RouterABI, pngRouterAddr);
        const lydRouter = await getContract(web3,RouterABI, lydRouterAddr);

        // Vault
        // Assume all Stablecoins have same value
        // Strategy
        if (stablecoinAddr === DAIAddr) amountDeposit = amountDeposit.div(toWei(toBN(1), "micro")); // convert to 6 decimals
        const amountInvestUSDTAVAX = amountDeposit.mul(toBN(500)).div(toBN(10000))
        const amountInvestUSDCAVAX = amountDeposit.mul(toBN(8000)).div(toBN(10000))
        const amountInvestMIMAVAX = amountDeposit.mul(toBN(1500)).div(toBN(10000))

        // Rebalancing - No rebalancing needed for this strategy
        // LYD
        const WAVAXAmtLYD = toBN((await getAmountsOut(lydRouter,amountInvestUSDTAVAX.div(toBN(2)), USDTAddr, WAVAXAddr))[1])
        const WAVAXAmtLYDMin = WAVAXAmtLYD.mul(amountOutMinPerc).div(denominator).toString()

        // PNG
        const WAVAXAmtPNG = toBN((await getAmountsOut(pngRouter, amountInvestUSDCAVAX.div(toBN(2)), USDCAddr, WAVAXAddr))[1])
        const WAVAXAmtPNGMin = WAVAXAmtPNG.mul(amountOutMinPerc).div(denominator).toString()

        // JOE
        const WAVAXAmtJOE = toBN((await getAmountsOut(joeRouter,amountInvestMIMAVAX.mul(toWei(toBN(1), "micro")).div(toBN(2)), MIMAddr, WAVAXAddr))[1])
        const WAVAXAmtJOEMin = WAVAXAmtJOE.mul(amountOutMinPerc).div(denominator).toString()

        return [0, WAVAXAmtLYDMin, WAVAXAmtPNGMin, WAVAXAmtJOEMin]
    }
}

export default CestaASADepositTokenMinPrice; 