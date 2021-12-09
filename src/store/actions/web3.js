export function web3Loaded(connection) {
    return {
        type: 'WEB3_LOADED',
        connection
    }
}

export function web3AccountLoaded(account,source) {
    return {
        type: 'WEB3_ACCOUNT_LOADED',
        account,
        source
    }
}

export function networkIdLoaded(networkId) {
    return {
        type: 'NETWORK_ID_LOADED',
        networkId
    }
}

export function disconnectWallet() {
    return {
        type: 'DISCONNECT_WALLET_EVENT'
    }
}

export function resetWeb3() {
    return {
        type: 'DISCONNECT_WALLET'
    }
}

export function changeWalletAction() {
    return {
        type: 'CHANGE_WALLET',
        value: new Date().getTime()
    }
}