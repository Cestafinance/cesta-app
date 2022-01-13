import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StyledButton } from "../Invest/Deposit";
import { Box, Typography } from '@mui/material';
import { styled } from "@mui/material/styles";
import { redeemBond } from "../../store/slices/bond-slice";
import ActionConfirm from "../Invest/modals/Modal";
import { BondProcessingTemplate } from "../Commons/SharedComponent";
import { messages } from "src/Constants/messages";
import { accountSelector, networkIdSelector, providerSelector } from "src/store/selectors/web3";

export const ReminderText = styled(Typography)(({theme}) => ({
    color: "#FFFFFF",
    fontStyle: "italic",
    fontFamily: "Inter",
    fontSize: "14px",
    textAlign: "justify"
}))

function Redeem({ bondData }) { 
    const [openModal, setOpenModal] = useState(false);
    
    const [modalProps, setModalProps] = useState(null);
    const [contentProps, setContentProps] = useState(null);
    
    const [isTransacting, setIsTransacting] = useState(false);

    const dispatch = useDispatch();
    const networkID = useSelector(networkIdSelector);
    const provider = useSelector(providerSelector);
    const account = useSelector(accountSelector);
    const transaction = useSelector(state => state.bondTransaction.transaction);

    const closeModal = () => {
        setTimeout(() => { 
            setOpenModal(false) 
            setIsTransacting(false);
        }, 2000);
    }
    
    useEffect(() => {
        if(["redeem_autostake", "redeem"].includes(transaction.type)) {
            // Transaction Error
            if(transaction.isError) {
                setContentProps({
                    message: transaction.type === 'redeem' ? `${messages.redeem_failed} ${bondData.bondToken}` : messages.autostake_failed,
                    subMessage: transaction.type === 'redeem' ? messages.failed_sub : `${messages.autostake_failed_sub} ${bondData.bondToken}`,
                    subMessage2: transaction.type === 'redeem' ? null : messages.failed_sub,
                    isTransacting: false, 
                    isError: true
                })

                // Close Modal
                closeModal();
            } else {
                // Successful approval
                if(transaction.isTransacting && transaction.transactionCompleted) {
                    setContentProps({
                        message: transaction.type === 'redeem' ? messages.redeem_successful : messages.autostake_successful,
                        subMessage: transaction.type === 'redeem' ? `${bondData.bondToken} ${messages.redeem_successful_sub}` : messages.autostake_successful_sub,
                        isTransacting: false, 
                        isError: false
                    });

                   // Close Modal
                    closeModal();
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
    
    const onRedeem = async (autostake = false) => {
        const modalTitle = autostake ? "Claim and Autostake" : "Claim Bond";
        setIsTransacting(true);
        setModalProps({ titleMain: modalTitle, subTitle: `from Bond Contract ${bondData.bondToken}`});
        setOpenModal(true);

        setContentProps({
            message: autostake ? messages.autostake_transacting : messages.redeem_transacting,
            subMessage: autostake ? messages.autostake_transacting_sub : messages.redeem_transacting_sub,
            isTransacting: true, 
            isError: false
        });

        await dispatch(redeemBond({ 
            address: account, 
            bond: bondData, 
            networkID, 
            provider, 
            autostake 
        }));
    }

    return <Box>
        <div style={{margin: "16px 0px"}}>
            <ReminderText>
                Redeem your Bond by claiming all your investment with rewards or Autostake the same to earn interest
            </ReminderText>
        </div>

        <div>
            <StyledButton disabled={parseFloat(bondData.pendingPayout) <= 0 || isTransacting} onClick={() => onRedeem(false)}>Claim</StyledButton>
            <StyledButton disabled={parseFloat(bondData.pendingPayout) <= 0 || isTransacting} sx={{marginTop: "16px"}} onClick={() => onRedeem(true)}>Claim and Stake</StyledButton>
        </div>


        <ActionConfirm 
            open={openModal}
            handleClose={() => setOpenModal(!openModal)}
            {...modalProps}
            content={<BondProcessingTemplate {...contentProps} />}
        />
    </Box>
}

export default Redeem;