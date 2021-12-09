import { useSelector } from 'react-redux';
import { web3Selector, networkIdSelector } from '../../../store/selectors/web3';
import { ChainID } from '../../../Constants/mains';

import CestaAXADepositTokenMinPrice from './slippage/deposit/cestaAXA';
import CestaAXSDepositTokenMinPrice from './slippage/deposit/cestaAXS';
import CestaASADepositTokenMinPrice from './slippage/deposit/cestaASA';

import CestaAXAWithdrawTokenMinPrice from './slippage/withdraw/cestaAXA';
import CestaAXSWithdrawTokenMinPrice from './slippage/withdraw/cestaAXS';
import CestaASAWithdrawTokenMinPrice from './slippage/withdraw/cestaASA';


const checkSupportedNetwork = (network) => {
    return [
        ChainID.ETHEREUM,
        ChainID.BSC,
        ChainID.AVALANCHE
    ].includes(network);
}

export function useTokenMinPriceWithdraw() {
    const web3 = useSelector(web3Selector);
    const network = useSelector(networkIdSelector);
    
    const getTokenPriceMin = async({ strategy, withdrawERC20Address, shareToWithdraw }) => {
        let tokenPriceMin = [];
        try {
            if(!checkSupportedNetwork(network)) {
                throw new Error(`Not in mainnet network`);
            }

            const strategyId = strategy.vaultInfo.symbol;
            if(!strategyId || strategyId === undefined || strategyId === "") {
                throw new Error(`Missing strategy id`);
            }

            const object = {
                web3,
                shareToWithdraw,
                stablecoinAddr: withdrawERC20Address, 
                strategy: strategy.address,
                strategyABI: strategy.abi,
                vault: strategy.vaultInfo.address,
                vaultABI: strategy.vaultInfo.abi,
            };

            switch (strategyId) {
                case "cestaAXS":
                    tokenPriceMin = await CestaAXSWithdrawTokenMinPrice.getAmountsOut(object);
                    break;
                case "cestaASA":
                    tokenPriceMin = await CestaASAWithdrawTokenMinPrice.getAmountsOut(object);
                    break;
                case "cestaAXA":
                    tokenPriceMin = await CestaAXAWithdrawTokenMinPrice.getAmountsOut(object);
                    break;
                default:
                    tokenPriceMin = [0]
                    break;
            }
          } catch (err) {
            console.error(`Error in getTokenPriceMin() withdraw, `, err);
          } finally{
            if(tokenPriceMin.length <= 0) {
                tokenPriceMin = [0];
            }
            return tokenPriceMin;
          }
    }

    return { getTokenPriceMin }
}

export function useTokenMinPriceDeposit() {
    const web3 = useSelector(web3Selector);
    const network = useSelector(networkIdSelector);
    
    const getTokenPriceMin = async({ strategy, depositERC20Address, depositAmount }) => {
        let tokenPriceMin = [];
        try {
            if(!checkSupportedNetwork(network)) {
                throw new Error(`Not in mainnet network`);
            }

            const strategyId = strategy.vaultInfo.symbol;
            if(!strategyId || strategyId === undefined || strategyId === "") {
                throw new Error(`Missing strategy id`);
            }
    
            const object = {
                web3,
                amountDeposit: depositAmount,
                stablecoinAddr: depositERC20Address, 
                strategy: strategy.address,
                strategyABI: strategy.abi,
                vault: strategy.vaultInfo.address,
                vaultABI: strategy.vaultInfo.abi,
            };

            switch (strategyId) {
                case "cestaAXS":
                    tokenPriceMin = await CestaAXSDepositTokenMinPrice.getAmountsOut(object);
                    break;
                case "cestaASA":
                    tokenPriceMin = await CestaASADepositTokenMinPrice.getAmountsOut(object);
                    break;
                case "cestaAXA":
                    tokenPriceMin = await CestaAXADepositTokenMinPrice.getAmountsOut(object);
                    break;
                default:
                    tokenPriceMin = [0]
                    break;
            }
          } catch (err) {
            console.error(`Error in getTokenPriceMin() deposit,  `, err);
          } finally{
            if(tokenPriceMin.length <= 0) {
                tokenPriceMin = [0];
            }
            return tokenPriceMin;
          }
    }

    return { getTokenPriceMin }
}