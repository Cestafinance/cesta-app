function stableCoins(state={}, action) {

    switch (action.type) {
        case 'STABLE_COIN_CONTRACT_LOADED':
            return {
                ...state,
                [action.address]: {
                    name: action.name,
                    contract: action.contract,
                    address: action.address,
                    decimals: action.decimals,
                    symbol: action.symbol
                }
            };
        default:
            return state;

    }
}

export default stableCoins;