export function contractLoaded(contract, {
    address,
    symbol,
    decimals,
    name
}) {
    return {
        type: "STABLE_COIN_CONTRACT_LOADED",
        contract,
        address,
        symbol,
        decimals,
        name
    }
}
