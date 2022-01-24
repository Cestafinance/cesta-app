import RouterABI from "../../../../../assets/abis/router-abi.json";
import {
    getContract,
    getAmountsOut,
} from "../util";
import { toBN } from 'web3-utils';

const DAIAddr = "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70"
const WAVAXAddr = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7"

const joeRouterAddr = "0x60aE616a2155Ee3d9A68541Ba4544862310933d4"
const pngRouterAddr = "0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106"
const lydRouterAddr = "0xA52aBE4676dbfd04Df42eF7755F01A3c41f28D27"

const JOEAddr = "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd"
const PNGAddr = "0x60781C2586D68229fde47564546784ab3fACA982"
const LYDAddr = "0x4C9B4E1AC6F24CdE3660D5E4Ef1eBF77C710C084"

let amountOutMinPerc = 995;
let networkFeePerc = 0; // Added network fee at 18/1/2022
class CestaAXADepositTokenMinPrice {    
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
        amountDeposit  = amountDeposit.sub(amountDeposit.mul(toBN(networkFeePerc)).div(toBN(10000)))
        amountOutMinPerc = toBN(amountOutMinPerc);
        const denominator = toBN(1000);

        //deXAvaxStrategyAddr, deXAvaxStrategyABI
        const deXAvaxStrategy = await getContract(web3,strategyABI, strategy);

        const joeRouter = await getContract(web3, RouterABI, joeRouterAddr);
        const pngRouter = await getContract(web3, RouterABI, pngRouterAddr);
        const lydRouter = await getContract(web3, RouterABI, lydRouterAddr);
       
        // Inside vault
        // const decimals = stablecoinAddr == DAIAddr ? 18 : 6
      
        const WAVAXAmt = toBN((await getAmountsOut(joeRouter, amountDeposit, stablecoinAddr, WAVAXAddr))[1]);
        const WAVAXAmtMin = WAVAXAmt.mul(amountOutMinPerc).div(denominator).toString();

         // Inside strategy
        let [pool0, pool1, pool2] = await deXAvaxStrategy.methods.getEachPool().call();
        pool0 = toBN(pool0); 
        pool1 = toBN(pool1);
        pool2 = toBN(pool2);
        const pool = toBN(pool0).add(toBN(pool1)).add(toBN(pool2)).add(toBN(WAVAXAmt))
        const JOEAVAXTargetPool = pool.mul(toBN(4500)).div(toBN(10000))
        const PNGAVAXTargetPool = JOEAVAXTargetPool;
        const LYDAVAXTargetPool = pool.mul(toBN(1000)).div(toBN(10000))

        // Rebalancing
        let JOEAmtMin, PNGAmtMin, LYDAmtMin
        JOEAmtMin = PNGAmtMin = LYDAmtMin = 0
        if (JOEAVAXTargetPool.gt(pool0) && PNGAVAXTargetPool.gt(pool1) && LYDAVAXTargetPool.gt(pool2)) {
            // JOE
            const amountInvestJOEAVAX = JOEAVAXTargetPool.sub(pool0);
            let JOEAmt = toBN((await getAmountsOut(joeRouter, amountInvestJOEAVAX.div(toBN(2)).toString(), WAVAXAddr, JOEAddr))[1])
            JOEAmtMin = JOEAmt.mul(amountOutMinPerc).div(denominator).toString()

            // PNG
            const amountInvestPNGAVAX = PNGAVAXTargetPool.sub(pool1)
            const PNGAmt = toBN((await getAmountsOut(pngRouter,amountInvestPNGAVAX.div(toBN(2)).toString(), WAVAXAddr, PNGAddr))[1])
            PNGAmtMin = PNGAmt.mul(amountOutMinPerc).div(denominator).toString()

            // LYD
            const amountInvestLYDAVAX = LYDAVAXTargetPool.sub(pool2)
            const LYDAmt = toBN((await getAmountsOut(lydRouter, amountInvestLYDAVAX.div(toBN(2)).toString(), WAVAXAddr, LYDAddr))[1])
            LYDAmtMin = LYDAmt.mul(amountOutMinPerc).div(denominator).toString()

        } else {
            let furthest = 0; 
            let farmIndex;
            let diff = 0;

            if (JOEAVAXTargetPool.gt(pool0)) {
                diff = JOEAVAXTargetPool.sub(pool0)
                furthest = diff
                farmIndex = 0
            }
            if (PNGAVAXTargetPool.gt(pool1)) {
                diff = PNGAVAXTargetPool.sub(pool1)
                if (diff.gt(furthest)) {
                    furthest = diff
                    farmIndex = 1
                }
            }
            if (LYDAVAXTargetPool.gt(pool2)) {
                diff = LYDAVAXTargetPool.sub(pool2)
                if (diff.gt(furthest)) {
                    furthest = diff
                    farmIndex = 2
                }
            }

            if (farmIndex === 0) {
                const JOEAmt = toBN((await getAmountsOut(joeRouter,WAVAXAmt.div(toBN(2)).toString(), WAVAXAddr, JOEAddr))[1])
                JOEAmtMin = JOEAmt.mul(amountOutMinPerc).div(denominator).toString()
            } else if (farmIndex === 1) {
                const PNGAmt = toBN((await getAmountsOut(pngRouter, WAVAXAmt.div(toBN(2)).toString(), WAVAXAddr, PNGAddr))[1])
                PNGAmtMin = PNGAmt.mul(amountOutMinPerc).div(denominator).toString()
            } else {
                const LYDAmt = toBN((await getAmountsOut(lydRouter, WAVAXAmt.div(toBN(2)).toString(), WAVAXAddr, LYDAddr))[1])
                LYDAmtMin = toBN(LYDAmt).mul(amountOutMinPerc).div(denominator).toString()
            }
        }
    
        return [WAVAXAmtMin, JOEAmtMin, PNGAmtMin, LYDAmtMin]
    }
}

export default CestaAXADepositTokenMinPrice; 