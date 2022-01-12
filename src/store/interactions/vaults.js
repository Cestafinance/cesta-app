import {
    contractLoaded
} from '../actions/vault';

export const loadVaultContract = async (dispatch, web3, abi, address, {
    name,
    symbol,
    decimals,
    strategyAddress
}) => {
    let contract = new web3.eth.Contract(abi, address);
    await dispatch(contractLoaded(contract, {
        address,
        name,
        symbol,
        decimals,
        strategyAddress
    }));
    return contract;
}

export const getDepositAmountFromContract = async (contract, address) => {
    try {
        let depositedAmount = await contract.methods.depositAmt(address).call();

        return depositedAmount;

    } catch (Err) {
        return 0;
    }
}

export const getPricePerFullShare = async(contract) => {
    let pricePerFullShare = 0;

    try {
        pricePerFullShare = await contract.methods.getPricePerFullShare().call();
    } catch (err) {


    } finally {

        // Return 0 when error is thrown, else return value from function call.
        return pricePerFullShare;
    }
}

export const calculateFee = async (vaultContract, strategyType, amount) => {
    try {
        const feePercent = await vaultContract.methods.networkFeePerc().call();
        return {
            success: true,
            feePercent: parseFloat(feePercent/100) || 0
        }

    } catch (Err) {
        return {
            success: false
        }
    }
}

export const depositToken = (contract, amount, token, account) => {
    return new Promise((resolve, reject) => {
        contract.methods
            .deposit(amount, token)
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

export const depositTokenThreeParam = (contract, amount, token, tokenPriceMin, account) => {
    return new Promise((resolve, reject) => {
        contract.methods
            .deposit(amount, token, tokenPriceMin)
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

export const withdrawToken = (contract, amount, token, account) => {
    return new Promise((resolve, reject) => {
        contract.methods
            .withdraw(amount, token)
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

export const withdrawTokenThreeParam = (contract, amount, token, tokenPriceMin, account) => {
    return new Promise((resolve, reject) => {
        contract.methods
            .withdraw(amount, token, tokenPriceMin)
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