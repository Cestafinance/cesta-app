import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useWeb3React } from '@web3-react/core'
import { StyledButton } from "../Invest/Deposit";
import { Box, Typography } from '@mui/material';
import { styled } from "@mui/material/styles";
import { redeemBond } from "../../store/slices/bond-slice";
import ActionConfirm from "../Invest/modals/Modal";
import { DetailLabel } from "./Price";

const ReminderText = styled(Typography)(({theme}) => ({
    color: "#FFFFFF",
    fontStyle: "italic",
    fontFamily: "Inter",
    fontSize: "14px",
    textAlign: "justify"
}))

const RewardsDetailContainer = styled(Box)(({theme}) => ({
    width: "100%",
    background: "none",
    border: "1px solid #565656",
    borderRadius: "16px",
    padding: "15px",
    color: "rgba(255, 255, 255, 0.6)"
}))

const RewardLabel = styled(DetailLabel) (({theme}) => ({
    fontSize: "16px",
    margin: "2px"
}))

function RewardsDetail() {
    return <>
        <Box sx={{display: "flex", alignItems: "center", justifyContent:"space-between"}}>
            <RewardLabel>Pending Rewards</RewardLabel>
            <RewardLabel>0 CESTA</RewardLabel>
        </Box>

        <Box sx={{display: "flex", alignItems: "center", justifyContent:"space-between"}}>
            <RewardLabel>Claimable Rewards</RewardLabel>
            <RewardLabel>0 CESTA</RewardLabel>
        </Box>

        <Box sx={{display: "flex", alignItems: "center", justifyContent:"space-between"}}>
            <RewardLabel>Time until fully vested</RewardLabel>
            <RewardLabel>Hello</RewardLabel>
        </Box>

        <Box sx={{display: "flex", alignItems: "center", justifyContent:"space-between"}}>
            <RewardLabel>ROI</RewardLabel>
            <RewardLabel>10 %</RewardLabel>
        </Box>

        <Box sx={{display: "flex", alignItems: "center", justifyContent:"space-between"}}>
            <RewardLabel>Vesting Terms</RewardLabel>
            <RewardLabel>5 dayss</RewardLabel>
        </Box>
    </>
}

function RedeemConfirm({
    autoStake,
    open, 
    setOpen
}) {
    const { checkWrongNetwork, address, chainId, provider } = useWeb3React();
    const dispatch = useDispatch();

    // const [open, setOpen] = useState(false);

    const onRedeem = async() => {
        if (await checkWrongNetwork()) {
            return;
        }

        await dispatch(redeemBond({
            address, 
            // bond, 
            networkID: chainId,
            provider,
            autoStake
        }))
    }

    const content= <>
        <RewardsDetailContainer>
            <RewardsDetail/>
        </RewardsDetailContainer>

        <StyledButton sx={{margin: "16px 0px"}}>{autoStake? "Claim and Stake" : "Claim"}</StyledButton>
    </>
    
    return <ActionConfirm
        open={open}
        handleClose={() => setOpen(!open)}
        titleMain={`Redeem`}
        content={content}
    />;
}


function Redeem() { 
    const [open, setOpen] = useState(false);
    const [autoStake, setAutoStake] = useState(false);
    
    const handleOpen = (autoStake) => {
        setOpen(true);
        setAutoStake(autoStake)
    }

    return <Box>
        <div style={{margin: "16px 0px"}}>
            <ReminderText>
                Redeem your Bond by claiming all your investment with rewards or Autostake the same to earn interest
            </ReminderText>
        </div>

        <div>
            <StyledButton onClick={() => handleOpen(false)}>Claim</StyledButton>
            <StyledButton sx={{marginTop: "16px"}} onClick={() => handleOpen(true)}>Claim and Stake</StyledButton>
        </div>

        <RedeemConfirm autoStake={autoStake} open={open} setOpen={setOpen}/>
    </Box>
}

export default Redeem;