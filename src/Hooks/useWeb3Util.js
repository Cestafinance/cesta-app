import { useCallback } from "react";
import { useSelector } from "react-redux";
import { web3Selector } from "../store/selectors/web3";

export default function useWeb3Util() {
    const web3 = useSelector(web3Selector)

    const units = {
        1: "wei",
        3: "kwei",
        6: "mwei",
        9: "gwei",
        12: "microether",
        18: "ether"
    };

    // Magnifying
    const toWei = useCallback((amount, decimals = 18) => {
        const decimalUnit = units[decimals];
        if (decimalUnit !== undefined) {
            return web3.utils.toWei(amount, decimalUnit);
        }
    }, [units])


    const fromWei = useCallback((amount, decimals = 18) => {
        const decimalUnit = units[decimals];
        if (decimalUnit !== undefined) {
            return web3.utils.fromWei(amount, decimalUnit);
        }
    }, [])


    return { toWei, fromWei }
}