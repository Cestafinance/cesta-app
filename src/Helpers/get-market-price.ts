import { ethers } from "ethers";
import { LpReserveContract } from "../assets/abis/v2";
import { mimTime } from "../helpers/bond";
import { Networks } from "../Constants/v2/blockchain";

export async function getMarketPrice(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    const mimTimeAddress = mimTime.getAddressForReserve(networkID);
    const pairContract = new ethers.Contract(mimTimeAddress, LpReserveContract, provider);
    const reserves = await pairContract.getReserves();
    const marketPrice = reserves[0] / reserves[1];
    return marketPrice;
}
