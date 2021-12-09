function web3(state = {}, action) {
    switch (action.type) {
        case 'WEB3_LOADED':
            return {
                ...state,
                connection: action.connection
            }
        case 'WEB3_ACCOUNT_LOADED':
            return {
                ...state,
                account: action.account,
                source: action.source
            }
        case 'NETWORK_ID_LOADED':
            return {
                ...state,
                networkId: action.networkId
            }
        case 'ETHER_BALANCE_LOADED':
            return {...state, balance: action.balance}
        case 'CHANGE_WALLET': {
            return {
                ...state,
                changeWallet: action.value
            }
        }
        case 'DISCONNECT_WALLET_EVENT':
            return {
                ...state,
                disconnect: true
            }
        case 'DISCONNECT_WALLET':
            return {
                ...state,
                connection: null,
                account: null,
                source: null,
                networkId: null,
                disconnect: null
            }
        default:
            return state;
    }
}

export default web3;