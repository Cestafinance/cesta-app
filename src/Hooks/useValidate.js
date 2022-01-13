export default function useValidateInput() {
    const validateInput = ({ value, tokenBalance }) => {
        const pattern = /^[0-9]\d*(\.\d+)?$/; // Accept only decimals or integer
        const isDigit = pattern.test(value);
    
        if(!isDigit) {  
            return { amount: value , error: true, info: "Invalid pattern."};
        }
        
        if(value === "" || value === null || value === undefined || value === 0 ) {
            return { amount: 0 , error: true, info: "Missing amount."};
        }
    
        let newAmount = value;
        const sufficientBalance =  newAmount <= tokenBalance;
      
        return { amount: newAmount, error: !sufficientBalance, info: `${!sufficientBalance ? "Insufficient Balance" : ""}`}
    }

    return { validateInput }
}