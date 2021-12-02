export function contractLoaded(contract, {
    address,
    symbol,
    decimals,
    name,
    strategyAddress
}) {
    return {
        type: "VAULT_CONTRACT_LOADED",
        contract,
        address,
        symbol,
        decimals,
        name,
        strategyAddress
    }
}
