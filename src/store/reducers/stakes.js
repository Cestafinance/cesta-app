function stakesReducer(state={}, action) {

    switch (action.type) {
        case 'STAKE_CESTA_TOKEN_LOADED':
            return {
                ...state,
                cestaToken: {
                    name: action.name,
                    contract: action.contract,
                    address: action.address,
                    decimals: action.decimals,
                    symbol: action.symbol,
                }
            }
        case 'STAKE_TOKEN_CONTRACT_LOADED':
            return {
                ...state,
                stakingToken: {
                    name: action.name,
                    contract: action.contract,
                    address: action.address,
                    decimals: action.decimals,
                    symbol: action.symbol,
                }

            }
        case 'STAKE_CONTRACT_LOADED':
            return {
                ...state,
                stakingContract: {
                    contract: action.contract,
                    address: action.address,
                }
            }
        case 'DISTRIBUTOR_CONTRACT_LOADED':
            return {
                ...state,
                distributorContract: {
                    contract: action.contract,
                    address: action.address,
                }
            }
        default:
            return state;

    }
}

export default stakesReducer;