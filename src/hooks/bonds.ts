import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import allBonds from "../helpers/bond";
import { IUserBondDetails } from "../store/slices/account-slice";
import { Bond } from "../helpers/bond/bond";
import { IBondDetails, IBondSlice } from "../store/slices/bond-slice";
import { IReduxState } from "../store/slices/state.interface";

// Smash all the interfaces together to get the BondData Type
export interface IAllBondData extends Bond, IBondDetails, IUserBondDetails {}

export const initialBondArray = allBonds;
// Slaps together bond data within the account & bonding states
function useBonds() {
    const bondLoading = useSelector<IReduxState, boolean>(state => state.bonding.loading);
    const bondState = useSelector<IReduxState, IBondSlice>(state => state.bonding);
    const allBonds = useSelector<IReduxState, IBondSlice>(state => state.bonding.bonds)
    const accountBondsState = useSelector<IReduxState, { [key: string]: IUserBondDetails }>(state => state.account.bonds);
    //@ts-ignore
    const [bonds, setBonds] = useState<IAllBondData[]>([]);

    useEffect(() => {
        if(allBonds !== undefined) {
            let bondDetails: IAllBondData[];
            bondDetails = allBonds
                .flatMap((bond: any) => {
                    if (bondState[bond.name] && bondState[bond.name].bondDiscount) {
                        return Object.assign(bond, bondState[bond.name]); // Keeps the object type
                    }
                    return bond;
                })
                .flatMap((bond: any) => {
                    if (accountBondsState[bond.name]) {
                        return Object.assign(bond, accountBondsState[bond.name]);
                    }
                    return bond;
                });

    
            const mostProfitableBonds = bondDetails.concat().sort((a, b) => {
                return a["bondDiscount"] > b["bondDiscount"] ? -1 : b["bondDiscount"] > a["bondDiscount"] ? 1 : 0;
            });
    
            setBonds(mostProfitableBonds);
        }
    }, [bondState, accountBondsState, bondLoading, allBonds]);

    return { bonds, loading: bondLoading };
}

export default useBonds;
