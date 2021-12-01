import {lazy} from 'react';

export const ChainID = {
    ETHEREUM: 1,
    KOVAN: 42,
    MATIC: 137,
    MUMBAI: 80001,
    BSCTEST: 97,
    BSC: 56,
    FANTOM: 250,
    FANTOMTEST: 4002,
    AVALANCHE: 43114,
    FUJI: 43113,
    ARBITRUM: 42161,
    ARBITRUMTEST: 421611,
    RINKEBY: 4
};

export const networkMap = {
    42:'kovan',
    1: 'mainnet',
    137: "polygon"
}


export const MenuList = [{
    name: 'invest',
    label: 'INVEST',
    path: '/invest',
    component: lazy(() => import('../Components/Invest'))
}, {
    name: 'bond',
    label: 'BOND',
    path: '/bond',
    component: lazy(() => import('../Components/Bond'))
}, {
    name: 'stake',
    label: 'STAKE',
    path: '/stake',
    component: lazy(() => import('../Components/Stake'))
}];

export const GraphTimeRanges = [{
    label: '1D',
    value: '1d'
}, {
    label: '1W',
    value: '7d'
}, {
    label: '1M',
    value: '1m'
}, {
    label: '6M',
    value: '6m'
}, {
    label: '1Y',
    value: '1y'
}];

