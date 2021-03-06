import {lazy} from 'react';

export const ChainID = {
    ETHEREUM: 1,
    KOVAN: 42,
    POLYGON: 137,
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
    43113: 'fuji',
    43114: 'avalanche',
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
    label: '1W',
    value: '7d'
}, {
    label: '1M',
    value: '30d'
}, {
    label: '6M',
    value: '6m'
}, {
    label: '1Y',
    value: '1y'
}];

export const networkScanUrl = {
    42:'https://kovan.etherscan.io/',
    1: 'https://etherscan.io/',
    43114: 'https://snowtrace.io/',
    43113: 'https://testnet.snowtrace.io/',
    137: "https://polygonscan.com/"
}

