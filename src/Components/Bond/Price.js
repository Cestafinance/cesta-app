import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, } from "@mui/material";
import { styled} from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { LoadingPulse } from "../Commons/SharedComponent";
import { trim, prettifySeconds, prettyVestingPeriod } from "../../helpers";

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
                : <LowerLabel sx={{ fontSize: "14px" }}>
                     {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    maximumFractionDigits: 3,
                                    minimumFractionDigits: 2,
                                }).format(trim(bondPrice, 2))}
                </LowerLabel>}
        </InfoContainer>

        <InfoContainer>
            <UpperLabel sx={{ fontSize: "16px" }}>Market Price</UpperLabel>
            {loading
                ? <LoadingPulse skeletonWidth={100} />
                : <LowerLabel sx={{ fontSize: "14px" }}>
                     {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    maximumFractionDigits: 3,
                                    minimumFractionDigits: 2,
                                }).format(trim(marketPrice, 2))}
                </LowerLabel>}
        </InfoContainer>
    </MainInfoContainer>
}

function BondingPrice({
    bondData,
}) {
    const classes = useStyles();

    const bonding = useSelector(state => state.bonding);
    const loading = useSelector(state => state.bonding.loading);
    const bond = bonding[bondData.bond];
     
    const [content, setContent] = useState([]);
    
    useEffect(() => {
        const priceContent = [
            [
                { label: "Available Balance", content: `${bondData !== undefined && bondData.balance !== undefined ? `${bondData.balance} ${bondData.bondToken}` : "0"}` },
                { label: "You Will Get", content: `${bond !== undefined && bond.bondQuote !== undefined ? trim(bond.bondQuote, 4) : '0'}  CESTA` },
                { label: "Max You Can Buy", content: `${bond !== undefined && bond.maxBondPrice !== undefined ? trim(bond.maxBondPrice, 4) : '0'} CESTA` },
            ],
            [
                { label: "ROI (Bond Discount)", content: `${bond !== undefined && bond.bondDiscount !== undefined ? trim(bond.bondDiscount * 100, 2) : ""}%` },
                { label: "Vesting Term", content: vestingPeriod() },
            ],
        ];

        setContent(priceContent);

    }, [bond, bondData.balance])

    const vestingPeriod = () => {
        if(bond === undefined) {
            return "";
        } 
        return prettifySeconds(bond.vestingTerm, "day");
    };

    return <>
        <MainInfo loading={loading} bondPrice={bond ? bond.bondPrice : 0} marketPrice={bond ? bond.marketPrice : 0} />

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
    bondData,
}) {
    const classes = useStyles();

    const bonding = useSelector(state => state.account.bonds);
    const loading = useSelector(state => state.account.loading);
    const userBond = bonding[bondData.bond];
    const currentBlockTime = useSelector(state => state.app.currentBlockTime);

    const [content, setContent] = useState([]);

    const vestingPeriod = () => {
        if(bondData === undefined) {
            return "";
        }
        return prettifySeconds(bondData.vestingTerm, "day");
    };

    const vestingTime = () => {
        if (!userBond) {
            return "";
        }
        return prettyVestingPeriod(currentBlockTime, userBond.bondMaturationBlock, false);
    };

    useEffect(() => {
        // console.log(`user bond detail from account bonds`, userBond);
        // console.log(`user bond detail from bond data`, bondData);

        const redeemContent = [
            [
                { label: "Pending Rewards", content: `${userBond && userBond.interestDue? `${userBond.interestDue} CESTA` : "-"}` },
                { label: "Claimable Rewards", content: `${userBond && userBond.pendingPayout ? trim(userBond.pendingPayout, 4) : '-'}  CESTA` },
                { label: "Time Until Fully Vested", content: `${userBond && vestingTime() } CESTA` },
            ],
            [
                { label: "ROI (Bond Discount)", content: `${bondData && bondData.bondDiscount ? trim(bondData.bondDiscount * 100, 2) : "-"}%` },
                { label: "Vesting Term", content: vestingPeriod() },
            ],
        ];

        setContent(redeemContent);

    }, [userBond, bondData.bondDiscount])

    return <>
         <MainInfo loading={loading} bondPrice={bondData ? bondData.bondPrice : 0} marketPrice={bondData ? bondData.marketPrice : 0} />

        {content.map(c => {
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
        ? <BondingPrice {...{bondData}}/>  
        : <RedeemPrice  {...{bondData}}/>}
    </>
}

export default Price;