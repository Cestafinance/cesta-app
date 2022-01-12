import { useCallback } from "react";
import { useSelector } from "react-redux";
import { getWalletAmount } from "../store/interactions/stableCoins";
import { accountSelector, web3Selector } from "../store/selectors/web3";
import { getPricePerFullShare } from "../store/interactions/vaults";
import useWeb3Util from "./useWeb3Util";

export default function useShares() {
    const account = useSelector(accountSelector);
    const web3 = useSelector(web3Selector);
    const { toWei, fromWei } = useWeb3Util();

    const calculateUserShareBalance = useCallback(
        async ({ contract }) => {
            const sharesRaw = await getWalletAmount(contract, account);
            const shares = fromWei(sharesRaw, 18);

            const priceRaw = await getPricePerFullShare(contract);
            const price = fromWei(priceRaw, 18);

            // Example deposited amount in usd = 0.23677 , after Math.floor() = 0.2367
            let depositedAmountInUSD = price * shares;
            depositedAmountInUSD = Math.floor(depositedAmountInUSD * 10000) / 10000;

            return {
                depositedAmountInUSD, // deposited amount after multiple with price per fulll share
                shares, // shares after divide by decimals
                price, // price after divide by decimals
                sharesRaw,
                priceRaw
            }

        },
        [account, toWei],
    )

    const calculateSharesToWithdraw = useCallback(
        async ({sharesInfo, amountToWithdraw}) => {
            const {
                shares, 
                sharesRaw, 
                price,
                depositedAmountInUSD
            } = sharesInfo;

            if(parseFloat(amountToWithdraw) === parseFloat(depositedAmountInUSD)) {
                return {
                    sharesToWithdrawRaw: sharesRaw,
                    sharesToWithdraw: shares
                }
            } else {
                const sharesToWithdraw = amountToWithdraw / price;
                const sharesToWithdrawRaw = toWei(sharesToWithdraw.toString(), 18);

                return {
                    sharesToWithdrawRaw,
                    sharesToWithdraw
                }
            }
        },
        [account, toWei],
    )

    return {
        calculateUserShareBalance,
        calculateSharesToWithdraw
    }
}