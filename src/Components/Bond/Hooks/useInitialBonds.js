import { useWeb3React } from "@web3-react/core";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { getAllBonds } from "src/Services/contracts";
import { networkMap } from "src/Constants/mains";
import { useDispatch } from "react-redux";
import { storeBonds, calcBondDetails } from "../../../store/slices/bond-slice";
import { LPBond } from "src/helpers/bond/lp-bond";
import { StableBond } from "src/helpers/bond/stable-bond";
import { providerSelector, networkIdSelector } from "../../../store/selectors/web3";

export function useInitiateBonds() {
    const dispatch = useDispatch();
    const provider = useSelector(providerSelector);
    const networkID = useSelector(networkIdSelector);

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

                    dispatch(calcBondDetails({ bond, value: null, provider, networkID }));

                    return { bond, token };
                }));
                const bonds = allBonds.map(a => a.bond);
                dispatch(storeBonds(bonds));
            }

        } catch (err) { 
            console.error(`Error in findBonds(): `, err);
            allBonds = [];
        } finally {
            return allBonds;
        }
        
    }, [networkID])

    return { findBonds }
}