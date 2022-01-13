import {get} from 'lodash';
import {createSelector} from "reselect";


const theme = state => get(state, 'app.theme');
export const themeSelector = createSelector(theme, t => t);

const account = state => get(state, 'web3.account');
export const accountSelector = createSelector(account, a => a);

const networkId = state => get(state, 'web3.networkId', 0);
export const networkIdSelector = createSelector(networkId, a => a);

const source = state => get(state, 'web3.source', '');
export const sourceSelector = createSelector(source, a => a);

const web3 = state => get(state, 'web3.connection');
export const web3Selector = createSelector(web3, w => w);

const disconnect = state => get(state, 'web3.disconnect');
export const disconnectSelector = createSelector(disconnect, d => d);

const changeWallet = state => get(state, 'web3.changeWallet');
export const changeWalletSelector  = createSelector(changeWallet, cw => cw);

const provider = state => get(state, 'web3.provider');
export const providerSelector = createSelector(provider, p => p);

const connected = state => get(state, 'web3.connected');
export const connectedSelector = createSelector(connected, d => d);