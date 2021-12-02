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

export const getPricePerFullShare = async(contract, vaultSymbol) => {
    let pricePerFullShare = 0;

    try {
        pricePerFullShare = await contract.methods.getPricePerFullShare().call();

        pricePerFullShare =  pricePerFullShare / 10 ** 18;


    } catch (err) {


    } finally {

        // Return 0 when error is thrown, else return value from function call.
        return pricePerFullShare;
    }
}

export const calculateFee = async (vaultContract, strategyType, amount) => {
    try {
        let percentageRange1 = await vaultContract.methods.networkFeePerc(0).call();
        let percentageRange2 = await vaultContract.methods.networkFeePerc(1).call();
        let percentageRange3 = await vaultContract.methods.networkFeePerc(2).call();

        let amountRange1 = await vaultContract.methods.networkFeeTier2(0).call();
        let amountRange2 = await vaultContract.methods.networkFeeTier2(1).call();

        const strategies = [
            "metaverse",
            "citadelv2",
            "daoStonks",
            "daoSafu",
            "daoTA",
            "daoDegen"
        ];

        let feePercent ;

        if (strategies.includes(strategyType)) {
            let amountRange3 = await vaultContract.methods.customNetworkFeeTier().call();
            let percentageRange4 = await vaultContract.methods.customNetworkFeePerc().call();

            if (amount < amountRange1) {
                feePercent = percentageRange1 / 100
            } else if (amount <= amountRange2) {
                feePercent = percentageRange2 / 100
            } else if (amount < amountRange3) {
                feePercent = percentageRange3 / 100
            } else {
                feePercent = percentageRange4 / 100
            }

        } else {
            if (amount < amountRange1) {
                feePercent = percentageRange1 / 100
            } else if (amount >= amountRange1 && amount <= amountRange2) {
                feePercent = percentageRange2 / 100
            } else {
                feePercent = percentageRange3 / 100
            }
        }

        return {
            success: true,
            feePercent
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
    console.log(amount, token);
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