import { useState } from "react";
import {
    Box, 
    Typography, 
} from "@mui/material";
import {styled} from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { LoadingPulse } from "../Commons/SharedComponent";

import {
    MainInfoContainer,
    InfoContainer,
    UpperLabel,
    LowerLabel
} from "./index";

const useStyles = makeStyles((theme) => ({
   priceDetailContainer: {
        color: "rgba(255, 255, 255, 0.6)",
        padding: "16px"
   }
}));

export const DetailLabel = styled(Typography)(({theme}) => ({
        fontStyle: 'normal',
        fontSize: '14px',
}));

const skeletonProps = { 
    animation: "pulse",
    variant: "text",
}

function BondingPrice({
    priceDetail, 
    loading = true
}) {
    const classes = useStyles();

    return <>
        <MainInfoContainer>
            <InfoContainer>
                <UpperLabel sx={{fontSize: "16px"}}>Bond Price</UpperLabel>
                {loading 
                    ? <LoadingPulse skeletonWidth={100} /> 
                    : <LowerLabel sx={{fontSize: "14px"}}>$21345678</LowerLabel> }
            </InfoContainer>
            
            <InfoContainer>
                <UpperLabel sx={{fontSize: "16px"}}>Market Price</UpperLabel>
                {loading 
                    ? <LoadingPulse skeletonWidth={100} /> 
                    : <LowerLabel sx={{fontSize: "14px"}}>$21345674</LowerLabel> }
            </InfoContainer>
        </MainInfoContainer>

        <div className={classes.priceDetailContainer}>
            <Box sx={{display: "flex", alignItems: "center", justifyContent:"space-between"}}>
                <DetailLabel>Available Balance</DetailLabel>
                { loading 
                    ?<LoadingPulse skeletonWidth={60} /> 
                    :<DetailLabel>1000 AVAX</DetailLabel> }
            </Box>

            <Box sx={{display: "flex", alignItems: "center", justifyContent:"space-between"}}>
                <DetailLabel>You Will Get</DetailLabel>
                { loading 
                    ?<LoadingPulse skeletonWidth={60} /> 
                    :<DetailLabel>123 CESTA</DetailLabel> }
            </Box>

            <Box sx={{display: "flex", alignItems: "center", justifyContent:"space-between"}}>
                <DetailLabel>Max You Can Buy</DetailLabel>
                { loading 
                    ?<LoadingPulse skeletonWidth={60} /> 
                    :<DetailLabel>456 CESTA</DetailLabel> }
            </Box>
        </div>

        <div className={classes.priceDetailContainer}>
            <Box sx={{display: "flex", alignItems: "center", justifyContent:"space-between"}}>
                <DetailLabel>ROI (Bond Discount)</DetailLabel>
                { loading 
                    ?<LoadingPulse skeletonWidth={60} /> 
                    :<DetailLabel>8.56%</DetailLabel> }
            </Box>

            <Box sx={{display: "flex", alignItems: "center", justifyContent:"space-between"}}>
                <DetailLabel>Vesting Term</DetailLabel>
                { loading 
                    ?<LoadingPulse skeletonWidth={60} /> 
                    :<DetailLabel>5 days</DetailLabel> }
            </Box>
        </div>
      
    </>;
}

function RedeemPrice({
    priceDetail, 
    loading = true
}) {
    const classes = useStyles();

    return <>
    <MainInfoContainer>
        <InfoContainer>
            <UpperLabel sx={{fontSize: "16px"}}>Bond Price</UpperLabel>
            {loading 
                ? <LoadingPulse skeletonWidth={100} /> 
                : <LowerLabel sx={{fontSize: "14px"}}>$21345678</LowerLabel> }
        </InfoContainer>
        
        <InfoContainer>
            <UpperLabel sx={{fontSize: "16px"}}>Market Price</UpperLabel>
            {loading 
                ? <LoadingPulse skeletonWidth={100} /> 
                : <LowerLabel sx={{fontSize: "14px"}}>$21345674</LowerLabel> }
        </InfoContainer>
    </MainInfoContainer>

    <div className={classes.priceDetailContainer}>
        <Box sx={{display: "flex", alignItems: "center", justifyContent:"space-between"}}>
            <DetailLabel>Pending Rewards</DetailLabel>
            { loading 
                ?<LoadingPulse {...skeletonProps} skeletonWidth={60} /> 
                :<DetailLabel>1000 CESTA</DetailLabel> }
        </Box>

        <Box sx={{display: "flex", alignItems: "center", justifyContent:"space-between"}}>
            <DetailLabel>Claimable Rewards</DetailLabel>
            { loading 
                ?<LoadingPulse {...skeletonProps} skeletonWidth={60} /> 
                :<DetailLabel>1200 CESTA</DetailLabel> }
        </Box>

        <Box sx={{display: "flex", alignItems: "center", justifyContent:"space-between"}}>
            <DetailLabel>Time Until Fully Vested</DetailLabel>
            { loading 
                ?<LoadingPulse {...skeletonProps} skeletonWidth={60} /> 
                :<DetailLabel>1 days 10 Hours</DetailLabel> }
        </Box>
    </div>

    <div className={classes.priceDetailContainer}>
        <Box sx={{display: "flex", alignItems: "center", justifyContent:"space-between"}}>
            <DetailLabel>ROI (Bond Discount)</DetailLabel>
            { loading 
                ?<LoadingPulse {...skeletonProps} skeletonWidth={60} /> 
                :<DetailLabel>8.56%</DetailLabel> }
        </Box>

        <Box sx={{display: "flex", alignItems: "center", justifyContent:"space-between"}}>
            <DetailLabel>Vesting Term</DetailLabel>
            { loading 
                ?<LoadingPulse {...skeletonProps} skeletonWidth={60} /> 
                :<DetailLabel>5 days</DetailLabel> }
        </Box>
    </div>
  
</>;
}
  

function Price({
    bondData, 
    tab = 0
}) {
    const classes = useStyles();

    const [loading, setLoading] = useState(false);

    const skeletonProps = { 
        animation: "pulse",
        variant: "text",
    }

    return <>
       {tab === 0 ? <BondingPrice/> : <RedeemPrice/>}
    </>
}

export default Price;