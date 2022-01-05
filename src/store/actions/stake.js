export function cestaTokenLoaded(contract, {
    address,
    symbol,
    decimals,
    name
}) {
    return {
        type: "STAKE_CESTA_TOKEN_LOADED",
        contract,
        address,
        symbol,
        decimals,
        name
    }
}

export function stakeTokenLoaded(contract, {
    address,
    symbol,
    decimals,
    name
}) {
    return {
        type: "STAKE_TOKEN_CONTRACT_LOADED",
        contract,
        address,
        symbol,
        decimals,
        name
    }
}

export function strategyContractLoaded(contract, {
    address,
}) {
    return {
        type: "STAKE_CONTRACT_LOADED",
        contract,
        address,
    }
}

export function distributionContractLoaded(contract, {
    address,
}) {
    return {
        type: "DISTRIBUTOR_CONTRACT_LOADED",
        contract,
        address,
    }
}