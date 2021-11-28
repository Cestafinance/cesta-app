import Web3 from 'web3';

import {
    web3Loaded,
    web3AccountLoaded,
    networkIdLoaded
} from '../actions/web3';

export const loadWeb3 = (dispatch, provider) => {
    const web3 = new Web3(provider || 'http://localhost:8545');
    dispatch(web3Loaded(web3));
    return web3;
}

export const loadAccount = async (dispatch,account,  networkId, source) => {
    await window.ethereum.enable();
    dispatch(web3AccountLoaded(account, source));
    dispatch(networkIdLoaded(networkId));
    return account;
}
