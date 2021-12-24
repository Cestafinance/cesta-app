import { ethers } from "ethers";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { getAllBonds } from "src/Services/contracts";
import { networkMap } from "src/Constants/mains";
import { useDispatch } from "react-redux";
import { storeBonds, calcBondDetails, loadBondAppDetail } from "../../../store/slices/bond-slice";
import { LPBond } from "../../../helpers/bond/lp-bond";
import { StableBond } from "../../../helpers/bond/stable-bond";
import { providerSelector, networkIdSelector, accountSelector } from "../../../store/selectors/web3";
import { calculateUserBondDetails } from "src/store/slices/account-slice";

export function useContract() {
    const provider = useSelector(providerSelector);
    const account = useSelector(accountSelector);

    const createContract = useCallback(async(address, abi) => {
        return new ethers.Contract(address, abi, provider);
    }, [provider]);

    const checkAllowance = useCallback(async(contract, spender) => {
        return (await contract.allowance(account,spender)).toString();
    }, [])

    return { createContract, checkAllowance };
}


export function useInitiateBonds() {
    const dispatch = useDispatch();
    const provider = useSelector(providerSelector);
    const networkID = useSelector(networkIdSelector);
    const account =useSelector(accountSelector);

    const findBonds = useCallback(async() => {
        let allBonds = [];

        try {
            const response = await getAllBonds(networkMap[networkID]);
            allBonds = response.data;

            if(allBonds&&allBonds.length > 0) {
                allBonds = await Promise.all(allBonds.map(async(b) => {
                    const token = b.token;
                    delete b.token;

                    // Create Bond Object
                    const bond = b.isLP
                        ? new LPBond(b)
                        : new StableBond(b);

                    // Getting bond detail
                    dispatch(calcBondDetails({ bond, value: null, provider, networkID }));

                    // Getting user bond detail 
                    dispatch(calculateUserBondDetails({
                        address: account,
                        bond,
                        provider, 
                        networkID
                    }))

                    return { bond, token };
                }));
              
                const bonds = allBonds.map(a => a.bond);
                dispatch(storeBonds(bonds));

                // To get CESTA price and Treasury Balance
                dispatch(loadBondAppDetail({
                    bonds, 
                    provider,
                    networkID
                }))
            }

        } catch (err) { 
            console.error(`Error in findBonds(): `, err);
            allBonds = [];
        } finally {
            return allBonds;
        }
        
    }, [networkID, account])

    return { findBonds }
}