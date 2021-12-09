import RouterABI from "../../../../../assets/abis/router-abi.json";
import {
    getContract,
    getAmountsOut,
} from "../util";
import { toWei, toBN } from 'web3-utils';

const USDTAddr = "0xc7198437980c041c805A1EDcbA50c1Ce5db95118"
const USDCAddr = "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664"
const DAIAddr = "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70"

const joeRouterAddr = "0x60aE616a2155Ee3d9A68541Ba4544862310933d4"
const pngRouterAddr = "0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106"
const lydRouterAddr = "0xA52aBE4676dbfd04Df42eF7755F01A3c41f28D27"

const JOEAddr = "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd"
const PNGAddr = "0x60781C2586D68229fde47564546784ab3fACA982"
const LYDAddr = "0x4C9B4E1AC6F24CdE3660D5E4Ef1eBF77C710C084"

let amountOutMinPerc = 995;

class CestaAXSDepositTokenMinPrice {    
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
        const denominator = toBN(10000);

        //deXAvaxStrategyAddr, deXAvaxStrategyABI
        const deXStableStrategy  = await getContract(web3,strategyABI, strategy);

        const joeRouter = await getContract(web3,RouterABI, joeRouterAddr);
        const pngRouter = await getContract(web3,RouterABI, pngRouterAddr);
        const lydRouter = await getContract(web3,RouterABI, lydRouterAddr);

        // Vault
        // Assume all Stablecoins have same value
        // Strategy
        if (stablecoinAddr === DAIAddr) amountDeposit = amountDeposit.div(toBN(1).pow(12));
        let [pool0, pool1, pool2] = await deXStableStrategy.methods.getEachPool().call();
        pool0 = toBN(pool0); 
        pool1 = toBN(pool1);
        pool2 = toBN(pool2);
        const pool = pool0.add(pool1).add(pool2).add(amountDeposit)
        const JOEUSDCTargetPool = pool.mul(toBN(8000)).div(toBN(10000))
        const PNGUSDTTargetPool = pool.mul(toBN(1000)).div(toBN(10000))
        const LYDDAITargetPool = PNGUSDTTargetPool

        // Rebalancing - No rebalancing for this strategy for now
        // JOE
        const amountInvestJOEUSDC = JOEUSDCTargetPool.sub(pool0)
        const JOEAmt = toBN((await getAmountsOut(joeRouter, amountInvestJOEUSDC.div(toBN(2)), USDCAddr, JOEAddr))[1])
        const JOEAmtMin = JOEAmt.mul(amountOutMinPerc).div(denominator).toString()
        
        // PNG
        const amountInvestPNGUSDT = PNGUSDTTargetPool.sub(pool1)
        const PNGAmt = toBN((await getAmountsOut(pngRouter,amountInvestPNGUSDT.div(toBN(2)), USDTAddr, PNGAddr))[1])
        const PNGAmtMin = PNGAmt.mul(amountOutMinPerc).div(denominator).toString();

        // LYD
        const amountInvestLYDDAI = LYDDAITargetPool.sub(pool2)
        const LYDAmt = toBN((await getAmountsOut(lydRouter, amountInvestLYDDAI.mul(toWei(toBN(1), "micro")).div(toBN(2)), DAIAddr, LYDAddr))[1])
        const LYDAmtMin = LYDAmt.mul(amountOutMinPerc).div(denominator).toString()

        return [0, JOEAmtMin, PNGAmtMin, LYDAmtMin]
    }
}

export default CestaAXSDepositTokenMinPrice; 