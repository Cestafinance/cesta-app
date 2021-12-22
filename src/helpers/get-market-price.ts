import { ethers } from "ethers";
import { LpReserveContract } from "../assets/abis/v2";
import { mimCesta } from "./bond";
import { Networks } from "../Constants/v2/blockchain";

export async function getMarketPrice(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    const mimCestaAddress = mimCesta.getAddressForReserve(networkID);
    const pairContract = new ethers.Contract(mimCestaAddress, LpReserveContract, provider);
    const reserves = await pairContract.getReserves();
    const marketPrice = reserves[0] / reserves[1];
    return marketPrice;
}
