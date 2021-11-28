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
        default:
            return state;
    }
}

export default web3;