export const getContract = async(web3, abi, address) => {
    return new web3.eth.Contract(abi, address);
}

export const getAmountsOut = async(contract, amount, address1, address2) => {
    return await contract.methods.getAmountsOut(amount, [address1, address2]).call();
}

export const getAllPoolInUSD = async(contract) => {
    return await contract.methods.getAllPoolInUSD().call();
}

export const totalSupply = async(contract) => {
    return await contract.methods.totalSupply().call();
}

export const balanceOf = async(contract, address) => {
    return await contract.methods.balanceOf(address).call();
}

export const getReserves = async(contract) => {
    return await contract.methods.getReserves().call();
}
