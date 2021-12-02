function strategiesReducer(state={}, action) {

    switch (action.type) {
        case 'STRATEGY_CONTRACT_LOADED':
            return {
                ...state,
                [action.address]: {
                    name: action.name,
                    contract: action.contract,
                    address: action.address,
                    decimals: action.decimals,
                    symbol: action.symbol,
                    vaultAddress: action.vaultAddress
                }
            }
        default:
            return state;

    }
}

export default strategiesReducer;