function vaultReducer(state={}, action) {

    switch (action.type) {
        case 'VAULT_CONTRACT_LOADED':
            return {
                ...state,
                [action.address]: {
                    name: action.name,
                    contract: action.contract,
                    address: action.address,
                    decimals: action.decimals,
                    symbol: action.symbol,
                    strategyAddress: action.strategyAddress
                }
            }
        default:
            return state;

    }
}

export default vaultReducer;