import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, } from "@mui/material";
import { styled} from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { LoadingPulse } from "../Commons/SharedComponent";
import { prettifySeconds } from "src/helpers";

import {
    MainInfoContainer,
    InfoContainer,
    UpperLabel,
    LowerLabel
} from "./index";
import { trim } from "src/helpers";

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

function LabelBoxes({
    loading, 
    label, 
    content
}) {
    return <Box sx={{display: "flex", alignItems: "center", justifyContent:"space-between"}}>
        <DetailLabel>{label}</DetailLabel>
        { loading 
            ?<LoadingPulse skeletonWidth={60} /> 
            :<DetailLabel>{content}</DetailLabel> }
    </Box>;
}

function MainInfo({
    loading,
    bondPrice, 
    marketPrice
}) {
    return <MainInfoContainer>
        <InfoContainer>
            <UpperLabel sx={{ fontSize: "16px" }}>Bond Price</UpperLabel>
            {loading
                ? <LoadingPulse skeletonWidth={100} />
                : <LowerLabel sx={{ fontSize: "14px" }}>$21345678</LowerLabel>}
        </InfoContainer>

        <InfoContainer>
            <UpperLabel sx={{ fontSize: "16px" }}>Market Price</UpperLabel>
            {loading
                ? <LoadingPulse skeletonWidth={100} />
                : <LowerLabel sx={{ fontSize: "14px" }}>$21345674</LowerLabel>}
        </InfoContainer>
    </MainInfoContainer>
}

function BondingPrice({
    bondData,
    loading = true
}) {
    const classes = useStyles();

    const bonding = useSelector(state => state.bonding);
    const [content, setContent] = useState([]);

    useEffect(() => {
        const bondId = bondData.bond;
        const priceDetail = bonding[bondId];

        const priceContent = [
            [
                { label: "Available Balance", content: `1000 AVAX` },
                { label: "You Will Get", content: `${priceDetail ? trim(priceDetail.bondQuote, 4) : '-'}  CESTA` },
                { label: "Max You Can Buy", content: `${priceDetail ? trim(priceDetail.maxBondPrice, 4) : '-'} CESTA` },
            ],
            [
                { label: "ROI (Bond Discount)", content: `${priceDetail ? trim(priceDetail.bondDiscount * 100, 2) : "-"}%` },
                { label: "You Will Get", content: vestingPeriod() },
            ],
        ];

        setContent(priceContent);

    }, [bonding, bondData])

    const vestingPeriod = () => {
        return prettifySeconds(bondData.vestingTerm, "day");
    };

    return <>
        <MainInfo loading={loading} bondPrice={null} marketPrice={null} />

        {content.map(c => {
            return <div className={classes.priceDetailContainer}>
                {c.map(d => {
                    return <LabelBoxes loading={loading} label={d.label} content={d.content} />
                })}
            </div>
        })}
    </>;
}

function RedeemPrice({
    priceDetail,
    loading = true
}) {
    const classes = useStyles();

    const priceContent = [
        [
            { label: "Pending Rewards", content: `1000 AVAX` },
            { label: "Claimable Rewards", content: `1000  CESTA` },
            { label: "Time Until Fully Vested", content: `5 hours` },
        ],
        [
            { label: "ROI (Bond Discount)", content: `-` },
            { label: "You Will Get", content: "-" },
        ],
    ];

    return <>
        <MainInfo loading={loading} bondPrice={null} marketPrice={null} />

        {priceContent.map(c => {
            return <div className={classes.priceDetailContainer}>
                {c.map(d => {
                    return <LabelBoxes loading={loading} label={d.label} content={d.content} />
                })}
            </div>
        })}
    </>;
}

function Price({
    bondData, 
    tab = 0,
    expanded
}) {
    const isLoading = useSelector(state => state.bonding.loading ?? true);

    return <>
       {tab === 0 
        ? <BondingPrice {...{bondData, loading: isLoading}}/>  
        : <RedeemPrice  {...{bondData, loading: isLoading}}/>}
    </>
}

export default Price;