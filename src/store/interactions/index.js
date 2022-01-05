export const balanceOf = async(contract, targetAddress) => {
    let balance = 0;
    try { 
        balance = await contract.methods.balanceOf(targetAddress).call();
    } catch (err) {
        console.error(`balance of: `, err);
    } finally {
        return balance;
    }
}

export const getAllPoolInUSD = async(contract) => {
    let pool = 0;
    try { 
        pool = await contract.methods.getAllPoolInUSD().call();
    } catch (err) {
        console.error(`pool: `, err);
    } finally {
        return pool;
    }
}

export const totalSupply = async(contract) => {
    let totalSupply = 0;
    try { 
        totalSupply = await contract.methods.totalSupply().call();
    } catch (err) {
        console.error(`totalSupply: `, err);
    } finally {
        return totalSupply;
    }
}

export const totalPendingDepositAmount = async(contract) => {
    let totalPendingDepositAmount = 0;
    try { 
        totalPendingDepositAmount = await contract.methods.totalPendingDepositAmt().call();
    } catch (err) {
        console.error(`totalPendingDepositAmount: `, err);
    } finally {
        return totalPendingDepositAmount;
    }
}

export const fees = async(contract) => {
    let fee = 0;
    try { 
        fee = await contract.methods.fees().call();
    } catch (err) {
        console.error(`fee: `, err);
    } finally {
        return fee;
    }
}