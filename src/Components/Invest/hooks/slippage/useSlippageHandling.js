import { useCallback, useEffect } from "react";
import useContract, { useTokenContract} from "../../../../Hooks/useContract";
import { Tokens } from "../../../../Constants/slippage";
import { useWeb3React } from "@web3-react/core";
import { balanceOf, fees, getAllPoolInUSD, totalPendingDepositAmount, totalSupply } from "../../../../store/interactions";
import web3 from "../../../../store/reducers/web3";
import { useSelector } from "react-redux";
import { web3Selector } from "../../../../store/selectors/web3";

export default function useSlippageHandling(vault) { 
    const { vaultAddress, vaultAbi, strategyAddress, strategyAbi } = vault;
    const { getTotalBalance } = useTotalStablecoinInStrategy();

    const vaultContract = useContract({ abi: vaultAbi, address: vaultAddress});
    const strategyContract = useContract({ abi: strategyAbi, address: strategyAddress});
   
    // Calculate amount in USD
    const getAmountWithdrawInUSD = useCallback(async(withdrawAmount) => {
        const vaultPool = await getAllPoolInUSD(vaultContract);
        const vaultTotalSupply = await totalSupply(vaultContract);
        const vaultTotalPendingDepositAmt = await totalPendingDepositAmount(vaultContract);

        return vaultPool
            .minus(vaultTotalPendingDepositAmt)
            .mul(withdrawAmount)
            .div(vaultTotalSupply);
    }, [vaultContract])

    const getPrices = useCallback(async(withdrawAmount, withdrawToken) => {
        // Withdraw amount in USD
        const withdrawAmountInUSD = await getAmountWithdrawInUSD(withdrawAmount);

        // Total stablecoins in vault
        const feesCharged = await fees(vaultContract);
        const totalBalances = await getTotalBalance(vaultAddress);
        const totalAmountInVaultWithoutFee = totalBalances?.total.minus(feesCharged);

        if(withdrawAmountInUSD.gt(totalAmountInVaultWithoutFee)) {
            const stableCoinAmountInVault = totalBalances.balances[withdrawToken.toLowerCase()];
            const oneEther = web3.utils.fromWei(1, "ether");

            // Not enough balance in vault, so have to withdraw from strategy
            const amountToWithdrawFromStrategy = withdrawAmountInUSD.minus(stableCoinAmountInVault);
            const strategyPool = await getAllPoolInUSD(strategyContract);
            const sharePercentage = amountToWithdrawFromStrategy.mul(oneEther).div(strategyPool);

            // 
            
            
        }


    }, [getAmountWithdrawInUSD, getTotalBalance, vaultAddress, vaultContract])

    return { getPrices };
}

function useTotalStablecoinInStrategy () {
    const { chainId } = useWeb3React();
    const usdtAddress = Tokens.USDT[chainId];
    const usdcAddress = Tokens.USDC[chainId];
    const daiAddress = Tokens.DAI[chainId];

    const usdtContract = useTokenContract(usdtAddress);
    const usdcContract = useTokenContract(usdcAddress); 
    const daiContract = useTokenContract(daiAddress);

    const getTotalBalance = useCallback(async(vaultAddress)=>{
        let _promises = [];
        _promises.push(balanceOf(usdtContract, vaultAddress));
        _promises.push(balanceOf(usdcContract, vaultAddress));
        _promises.push(balanceOf(daiContract, vaultAddress));
    
        let balances = await Promise.allSettled(_promises);
        balances = balances.map(b => b.value);

    
        const usdtBalance = balances[0]?.value.mul(web3.utils.toBN(10).pow(12)); // base 18
        const usdcBalance = balances[1]?.value.mul(web3.utils.toBN(10).pow(12)); // base 18
        const daiBalance = balances[2];

        const total = usdtBalance + usdcBalance + daiBalance

        return {
            balances: {
                [usdtAddress.toLowerCase()]: usdtBalance,
                [usdcAddress.toLowerCase()]: usdcBalance,
                [daiAddress.toLowerCase()]: daiBalance,
            },
            total
        };
 
    }, [daiAddress, daiContract, usdcAddress, usdcContract, usdtAddress, usdtContract])

    return { getTotalBalance }
}