import {contractLoaded} from "../actions/stableCoins";

export const contractLoad = async ( dispatch, web3, abi, address,{
    name,
    symbol,
    decimals
}) => {
    let contract = new web3.eth.Contract(abi, address);
    await dispatch(contractLoaded(contract, {
        address,
        name,
        symbol,
        decimals
    }));
    return contract;
}

export const getWalletAmount = async (contract, account) => {
    try {
        let balance = contract.methods.balanceOf(account).call();
        return balance;
    } catch (Err) {
        return 0;
    }
}



export const checkAllowance = async (stableCoinContract, strategyAddress, account, web3, amount) => {
    try {
        const allowance = await stableCoinContract.methods
            .allowance(account, strategyAddress)
            .call({from: account});

        const ethAllowance = web3.utils.fromWei(allowance, "ether");

        return {
            success: true,
            needApproval: parseFloat(ethAllowance) < parseFloat(amount)
        }

    } catch (Err) {
        console.log(Err);
        return {
            success: false,
        };
    }
}

export const approveToken = async (stableCoinContract, strategyAddress, account, web3) => {
   return new Promise((resolve, reject) => {
       stableCoinContract.methods
           .approve(strategyAddress, web3.utils.toWei("999999999999", "ether"))
           .send({
               from: account,
           })
           .on("transactionHash", function (txnHash) {
               console.log(txnHash);
           })
           .on("receipt", function (receipt) {
               console.log(receipt);
               resolve({
                   success: true
               })
           })
           .on("error", function (error) {
               resolve({
                   success: false
               })
           });
   });
}