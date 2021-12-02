export function contractLoaded(contract, {
    address,
    symbol,
    decimals,
    name,
    vaultAddress
}) {
    return {
        type: "STRATEGY_CONTRACT_LOADED",
        contract,
        address,
        symbol,
        decimals,
        name,
        vaultAddress
    }
}
