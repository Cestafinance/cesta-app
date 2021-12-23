import { useState, useEffect } from "react";
import { styled, makeStyles } from "@mui/styles";
import { TextField, Box } from "@mui/material";
import { StyledButton } from "../Invest/Deposit";
import { ErrorText, ScaleButtons, BondProcessingTemplate } from "../Commons/SharedComponent";
import { useDispatch, useSelector } from "react-redux";
import ActionConfirm from "../Invest/modals/Modal";
import { ReminderText } from "./Redeem";
import { messages } from "../../Constants/messages";
import { bondAsset, changeApproval } from "../../store/slices/bond-slice";
import { accountSelector, networkIdSelector, providerSelector } from "src/store/selectors/web3";

const StyledTextField = styled(TextField)(({ theme }) => ({
    "&.MuiTextField-root": {
      width: "100%",
      background: "#1B203C",
      borderRadius: "20px",
      boxSizing: "border-box",
    },
    "& .MuiInputBase-root": {
      background: "#1B203C",
      boxSizing: "border-box",
      borderRadius: "20px",
      width: "100%",
      color: "#FFFFFF",
    },
    "&.Mui-error": {
      borderRadius: "20px",
    },
}));

const useStyles = makeStyles(({ theme }) => ({
    logoStableCoins: {
      height: "20px",
      marginTop: "2px",
    },

    errorContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: "15px",
        alignItems: "center",
        width: "100%"
    }
}));

function Purchase({  
   bondData
}) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const transaction = useSelector(state => state.bondTransaction.transaction);

    const provider = useSelector(providerSelector);
    const networkID = useSelector(networkIdSelector);
    const account = useSelector(accountSelector);
    
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState(false);
    const [tokenBalance, setTokenBalance] = useState(0);
    const [requireApprove, setRequireApprove] = useState(false);

    const [isTransacting, setIsTransacting] = useState(false);
    
    const [openModal, setOpenModal] = useState(false);
    const [modalProps, setModalProps] = useState(null);
    const [contentProps, setContentProps] = useState(null);
    

    useEffect(() => {
        setRequireApprove(bondData.allowance !== undefined ? bondData.allowance<=0 : false);
        setTokenBalance(bondData.balance ? bondData.balance : 0);
    }, [bondData.allowance, bondData.balance])

    useEffect(() => {
        if(["approve", "bond"].includes(transaction.type)) {
            // Transaction Error
            if(transaction.isError) {
                setContentProps({
                    message: transaction.type === 'approve' ? messages.approve_failed : messages.bond_failed,
                    subMessage: messages.failed_sub,
                    isTransacting: false, 
                    isError: true
                });
                setIsTransacting(false);
            } else {
                // Successful approval
                if(transaction.isTransacting && transaction.transactionCompleted) {
                    setContentProps({
                        message: transaction.type === 'approve' ? messages.approve_successful : messages.bond_successful_main,
                        subMessage: transaction.type === 'approve' ? "" : `${messages.bond_successful_sub} ${bondData.bondToken}`,
                        isTransacting: false, 
                        isError: false
                    });

                    // Close Modal
                    setTimeout(() => { 
                        setOpenModal(false) 
                        setIsTransacting(false);
                    }, 2000);
                }

                // No ongoing transaction
                if(!transaction.isTransacting && transaction.txHash === undefined) {
                    setContentProps({
                        message: null,
                        subMessage: null,
                        isTransacting: false, 
                        isError: false
                    });
                }
            }
        }
    }, [transaction])

    const onInputChange = (value) => {
        let decimals = value.match(/\./g);
        
        if (
          (decimals &&
            decimals.length === 1 &&
            value[value.length - 1] === ".") ||
          value[value.length - 1] === "0"
        ) {
          setError(tokenBalance < value);
          setAmount(value);
          return;
        }

        let newVal = parseFloat(value);
        newVal = isNaN(newVal) ? 0 : newVal;
        setError(tokenBalance < value);
        setAmount(newVal);
    };

    const handlePercentSelected = ({percent}) => {
        const newAmount = (Math.floor(tokenBalance * 1000) / 1000) * (percent / 100);
        setAmount(newAmount);
    }

    const onApproveToken = async() => {
        setIsTransacting(true);
        setModalProps({ titleMain: "Approve Bond", subTitle: `for Bond Contract ${bondData.bondToken}`});
        setOpenModal(true);

        setContentProps({
            message: messages.approve_transacting,
            subMessage: null,
            isTransacting: true, 
            isError: false
        });

        dispatch(changeApproval({
            bond: bondData, 
            provider,
            networkID,
            address: account
        }))
    }

    const onBonding = async() => {
        if(Number(amount) === 0 || isNaN(amount)) {
            setError(true);
            return;
        }
        
        // TODO: Add bond interest due and pending payout checking
        
        setIsTransacting(true);
        setModalProps({ titleMain: "Purchase Bond", subTitle: `for Bond Contract ${bondData.bondToken}`});
        setOpenModal(true);

        setContentProps({
            message: messages.bond_transacting,
            subMessage: messages.bond_transacting_sub,
            isTransacting: true, 
            isError: false
        });

        dispatch(bondAsset({
            value: amount.toString(),
            slippage: null, // TODO: Slippage setting
            bond: bondData,
            networkID,
            provider, 
            address: account,
            useAvax: false
        }))
    }

    return <div style={{color: "#ffffff", width: "100%"}}>
        <div style={{ position: "relative" }}>
            <StyledTextField
                value={amount}
                onChange={(e) => onInputChange(e.target.value)}
                error={error}
            />

            <Box sx={{
                cursor: "pointer",
                position: "absolute",
                right: "24px",
                top: "15px",
            }}>
                <div style={{display: "flex", alignItems:"center"}}>
                    <img src={"https://via.placeholder.com/20"} alt="token"/>
                    <span style={{marginLeft: "8px"}}>{bondData.bondToken}</span>
                </div>
            </Box>
        </div>

        <div className={classes.errorContainer}>
            <div style={{width:"60%"}}>   
                {error && <ErrorText sx={{textAlign: "start"}}>Invalid Amount</ErrorText>}
            </div>
           
            <div style={{width:"40%"}}>
                <ScaleButtons onPercentSelected={handlePercentSelected}/>
            </div>
        </div>

        <div style={{margin:"20px 0px"}}>
            <StyledButton disabled={isTransacting}
                onClick={() => requireApprove ? onApproveToken() : onBonding()}
                >
                {requireApprove ? 'APPROVE' : 'BOND' } 
            </StyledButton>

            <ReminderText sx={{marginTop: "16px", color: "grey"}}> 
                {tokenBalance>0 && requireApprove && <span>{`First time bonding ${bondData.bondToken} ? Please approve Cesta Finance to use your ${bondData.bondToken} for bonding.`}</span>}
            </ReminderText>
        </div>

        <ActionConfirm 
            open={openModal}
            handleClose={() => setOpenModal(!openModal)}
            {...modalProps}
            content={<BondProcessingTemplate {...contentProps} />}
        />
    </div>
}

export default Purchase;

