import {cestaTokenLoaded, stakeTokenLoaded, strategyContractLoaded, distributionContractLoaded} from "../actions/stake";

export const loadCestaTokenContract = async (dispatch, web3, abi, address, {
    name,
    symbol,
    decimals
}) => {
    let contract = new web3.eth.Contract(abi, address);
    await dispatch(cestaTokenLoaded(contract, {
        address,
        name,
        symbol,
        decimals
    }));
    return {
        contract,
        address,
        name,
        symbol,
        decimals
    };

}

export const loadStakingTokenContract = async (dispatch, web3, abi, address, {
    name,
    symbol,
    decimals
}) => {
    let contract = new web3.eth.Contract(abi, address);
    await dispatch(stakeTokenLoaded(contract, {
        address,
        name,
        symbol,
        decimals
    }));
    return {
        contract,
        address,
        name,
        symbol,
        decimals
    };
}

export const loadStakingContract = async (dispatch, web3, abi, address) => {
    let contract = new web3.eth.Contract(abi, address);
    await dispatch(strategyContractLoaded(contract, {
        address
    }));
    return {
        contract,
        address
    };
}

export const distributorContract = async (dispatch, web3, abi, address) => {
    let contract = new web3.eth.Contract(abi, address);
    await dispatch(distributionContractLoaded(contract, {
        address
    }));
    return {contract, address};
}

export const checkAllowance = async (tokenContract, stakeContractAddress, account, web3, amount) => {
    try {
        const allowance = await tokenContract.methods
            .allowance(account, stakeContractAddress)
            .call({from: account});

        const allowanceBN = new web3.utils.BN(allowance)

        return {
            success: true,
            needApproval: allowanceBN.lt(new web3.utils.BN(amount))
        }

    } catch (Err) {
        console.log(Err);
        return {
            success: false,
        };
    }
}

export const approveToken = async (cestaContract, stakeContractAddress, account, web3) => {
    return new Promise((resolve, reject) => {
        cestaContract.methods
            .approve(stakeContractAddress, web3.utils.toWei("999999999999", "ether"))
            .send({
                from: account,
            })
            .on("transactionHash", function (txnHash) {
                console.log(txnHash);
            })
            .on("receipt", function (receipt) {
                console.log(receipt);
                resolve({
                    success: true,
                    receipt
                })
            })
            .on("error", function (error) {
                resolve({
                    success: false
                })
            });
    });
}

export const depositStake = async (stakeContract, account, web3, amount) => {
    return new Promise((resolve, reject) => {
        stakeContract.methods
            .stake(amount, account)
            .send({
                from: account,
            })
            .on("transactionHash", function (txnHash) {
                console.log(txnHash);
            })
            .on("receipt", function (receipt) {
                console.log(receipt);
                return resolve({
                    success: true,
                    receipt
                })
            })
            .on("error", function (error) {
                return resolve({
                    success: false
                })
            })
    })
}

export const unStakeToken = async (stakeContract, amount, web3, account) => {
    return new Promise((resolve, reject) => {
        stakeContract.methods
            .unStake(amount, true)
            .send({
                from: account,
            })
            .on("transactionHash", function (txnHash) {
                console.log(txnHash);
            })
            .on("receipt", function (receipt) {
                console.log(receipt);
                return resolve({
                    success: true,
                    receipt
                })
            })
            .on("error", function (error) {
                return resolve({
                    success: false
                })
            })
    });
}