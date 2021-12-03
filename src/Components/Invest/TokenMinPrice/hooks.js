import { useSelector } from 'react-redux';
import { web3Selector, networkIdSelector } from '../../../store/selectors/web3';
import { ChainID } from '../../../Constants/mains';
import TokensMinInfo from './tokenConstant';
import DAOAXSTokenMinPrice from './slippage/daoAXS';
import DAOAXATokenMinPrice from './slippage/daoAXA';
import DAOASATokenMinPrice from './slippage/daoASA';

export function useTokenMinPrice() {
    const web3 = useSelector(web3Selector);
    const network = useSelector(networkIdSelector);

    const minPercentage = 95;

    const getAmountsOut = async(contract, amount, pairs) => {
        let result = [];
        try {
            result = await contract.methods.getAmountsOut(amount, pairs).call();
        } catch (err) {
            console.error(`Error in getAmountsOut(): `, err);
        } finally {
            return result;
        }
    } 
    
    const getTokenPriceMin = async({ asset, withdrawERC20Address, shareToWithdraw }) => {
        let tokenPriceMin = [];
        try {
            const supportedNetwork = [
                ChainID.ETHEREUM,
                ChainID.BSC,
                ChainID.AVALANCHE
            ];
    
            if(!supportedNetwork.includes(network)) {
                throw new Error(`Not in mainnet network`);
            }

            const strategyId = asset.vaultInfo.symbol;
        
            if(!strategyId || strategyId === undefined || strategyId === "") {
                throw new Error(`Missing strategy id`);
            }
    
            const tokensInfo = TokensMinInfo[strategyId];
            if(!tokensInfo || tokensInfo === undefined) {
                throw new Error(`Tokens Info undefined`);
            }
    
            // Avalanche Strategy 
            if(["daoAXA", "daoAXS","daoASA", "daoA2S"].includes(strategyId)){
                // Temp solution, should use info from store
                const object = {
                    web3,
                    asset,
                    shareToWithdraw,
                    withdrawERC20Address, 
                    network
                };
    
                switch (strategyId) {
                    case "daoAXS":
                        tokenPriceMin = await DAOAXSTokenMinPrice.getAmountsOut(object);
                        break;
                    case "daoASA":
                        tokenPriceMin = await DAOASATokenMinPrice.getAmountsOut(object);
                        break;
                    case "daoAXA":
                        tokenPriceMin = await DAOAXATokenMinPrice.getAmountsOut(object);
                        break;
                    default:
                        tokenPriceMin = [0]
                        break;
                }
            } else {
                const routerContracts = [];
                const routerAddresses = tokensInfo.routerAddresses;
    
                for(let i = 0; i < routerAddresses.length; i++) {
                    const routerContract = new web3.eth.Contract(
                        tokensInfo.abi,
                        routerAddresses[i]
                    );
                    routerContracts.push(routerContract);
                }
          
                const tokensPairs = tokensInfo.tokens;
    
                const contractTypes = [
                    "citadelv2",
                    "daoSafu",
                    "daoDegen",
                    "daoTA",
                ];
    
                for(let i = 0; i < tokensPairs.length; i ++) {
                    const tokenPair = tokensPairs[i];
                    let { amount, decimal, pairs, routerIndex } = tokenPair;
                    
                    if(i === 0 && contractTypes.includes(strategyId)) {
                        pairs.push(withdrawERC20Address);
                    }
    
                    const magnifiedAmount =  web3.utils.toBN(amount * 10 ** decimal);
                    const price = await getAmountsOut(
                        routerContracts[routerIndex],
                        magnifiedAmount,
                        pairs
                    );
                    // console.log(`${magnifiedAmount}, price ${price[1]}, pairs`, pairs);
                   
                    let priceMin = web3.utils.toBN(price[1]).muln(minPercentage).divn(100); 
                    if(priceMin === undefined) {
                        console.error(`Price Min is undefined for`, tokenPair.pairs);
                        priceMin = 0;
                    }
                   
                    tokenPriceMin.push(priceMin.toString());
                }
            }
    
          } catch (err) {
            console.error(`Error in getTokenPriceMin(), `, err);
          } finally{
            if(tokenPriceMin.length <= 0) {
                tokenPriceMin = [0];
            }
            return tokenPriceMin;
          }
    }

    return { getTokenPriceMin }
}