import {
    contractLoaded
} from '../actions/strategy';

export const loadStrategyContract = async (dispatch, web3, abi, address, {
    name,
    symbol,
    decimals,
    vaultAddress
}) => {
    let contract = new web3.eth.Contract(abi, address);
    await dispatch(contractLoaded(contract, {
        address,
        name,
        symbol,
        decimals,
        vaultAddress
    }));
    return contract;
}