import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../Constants/v2/blockchain";
import { BondingCalcContract } from "../assets/abis/v2";
import { ethers } from "ethers";
import { getAddresses } from "../Constants/v2/addresses";

export function getBondCalculator(networkID: Networks, provider: StaticJsonRpcProvider) {
    const addresses = getAddresses(networkID);
    return new ethers.Contract(addresses.TIME_BONDING_CALC_ADDRESS, BondingCalcContract, provider);
}
