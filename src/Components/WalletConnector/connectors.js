import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { LedgerConnector } from "@web3-react/ledger-connector";
import { TrezorConnector } from "@web3-react/trezor-connector";
import { ChainID } from "../../Constants/mains";

const supportedChainIds = [
    1, // ethereum
    42, // kovan
    137, // matic
    80001, // mumbai,
    56, // bsc
    97, // bsc test
    250, // fantom 
    4002, // fantom test
    43114, // avalanche 
    43113, // fuji
    42161, // arbitrum
    421611, // arbitrum test
];

export const injected = new InjectedConnector({
    supportedChainIds,
});

const POLLING_INTERVAL = 12000;
const RPC_URLS = {
    [ChainID.ETHEREUM]: "https://eth-mainnet.alchemyapi.io/v2/k2--UT_xVVXMOvAyoxJYqtKhlmyBbqnX",
    [ChainID.RINKEBY]: "https://rinkeby.infura.io/v3/bd80ce1ca1f94da48e151bb6868bb150",
    [ChainID.KOVAN]: 'https://eth-kovan.alchemyapi.io/v2/6OVAa_B_rypWWl9HqtiYK26IRxXiYqER',
    [ChainID.MATIC]: 'https://rpc-mainnet.maticvigil.com',
    [ChainID.MUMBAI]: 'https://rpc-mumbai.matic.today',
    [ChainID.BSC]: 'https://bsc-dataseed.binance.org/',
    [ChainID.BSCTEST]: 'https://data-seed-prebsc-2-s3.binance.org:8545',
    [ChainID.FANTOM]: 'https://rpcapi.fantom.network',
    [ChainID.FANTOMTEST]: 'https://rpc.testnet.fantom.network',
    [ChainID.AVALANCHE]: 'https://api.avax.network/ext/bc/C/rpc',
    [ChainID.FUJI]: 'https://api.avax-test.network/ext/bc/C/rpc',
    [ChainID.ARBITRUM]: 'https://arb1.arbitrum.io/rpc',
    [ChainID.ARBITRUMTEST]: 'https://rinkeby.arbitrum.io/rpc'
};

// export const network = new NetworkConnector({
//   urls: { 1: RPC_URLS[1], 4: RPC_URLS[4] },
//   defaultChainId: 1,
//   pollingInterval: POLLING_INTERVAL
// });

export const walletconnect = new WalletConnectConnector({
    rpc: { 1: RPC_URLS[1] },
    bridge: "https://bridge.walletconnect.org",
    qrcode: true,
    pollingInterval: POLLING_INTERVAL
});

export const walletlink = new WalletLinkConnector({
    url: RPC_URLS[1],
    appName: "iearn.financaae"
});

export const ledger = new LedgerConnector({
    chainId: 1,
    url: RPC_URLS[1],
    pollingInterval: POLLING_INTERVAL
});

export const trezor = new TrezorConnector({
    chainId: 1,
    url: RPC_URLS[1],
    pollingInterval: POLLING_INTERVAL,
    manifestEmail: "dummy@abc.xyz",
    manifestAppUrl: "https://8rg3h.csb.app/"
});

