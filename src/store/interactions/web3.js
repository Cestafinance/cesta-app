import Web3 from 'web3';
import { ethers } from 'ethers';

import {
    web3Loaded,
    web3AccountLoaded,
    networkIdLoaded,
    setProvider
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

export const loadProvider = (dispatch, provider) => {
    const web3Provider = new ethers.providers.Web3Provider(provider);
    dispatch(setProvider(web3Provider));
    return web3Provider;
}
