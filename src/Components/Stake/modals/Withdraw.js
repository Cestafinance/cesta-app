import { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Button,
    Tooltip
} from "@mui/material";
import {useSelector} from "react-redux";
import { makeStyles, styled } from "@mui/styles";
import InfoIcon from '@mui/icons-material/Info';
import {web3Selector, sourceSelector, accountSelector} from "../../../store/selectors/web3";
import {
    unStakeToken
} from "../../../store/interactions/stake";
import Done from "../../../assets/commons/done.png";
import Errored from "../../../assets/commons/errored.png";
import CestaLogo from "../../../assets/logos/cesta.png";

const useStyles = makeStyles((theme) => ({
    hrBreak: {
        width: "85%",
        border: "1px solid #565656"
    },
    cestaLogo: {
        height: "25px"
    }
}));

const StyledButton = styled(Button)(({ theme }) => ({
    "&.MuiButton-root": {
        background: theme.palette.primary.main,
        width: "50%",
        marginLeft: "25%",
        height: "35px",
        boxShadow: "none",
        borderRadius: "16px",
        zIndex: 4,
        color: "#FFFFFF",
        padding: "12px 0px",
        textTransform: "uppercase",
        fontSize: "16px",
        "&:hover": {
            background: "rgba(39, 62, 112, 0.5)",
        },
    },
    "&.Mui-disabled": {
        backgroundColor: "none",
    },
}));

const ReceivingAmountLabel = styled(Typography)(({theme}) => ({
    "&.MuiTypography-root": {
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "18px",
        lineHeight: "25px",
        textAlign: "center",
        color: "rgba(255, 255, 255, 0.6)",
    },
}));

const TokenAmount = styled(Typography)(({theme}) => ({
    "&.MuiTypography-root": {
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "18px",
        lineHeight: "25px",
        textAlign: "right",
        color: "rgba(255, 255, 255, 0.6)",
    },
}));

const InfoText = styled(Typography)(() => ({
    "&.MuiTypography-root": {
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "15px",
        lineHeight: "16px",
        color: "rgba(255, 255, 255, 0.6)",
    },
}));

const InfoTextValue = styled(Typography)(() => ({
    "&.MuiTypography-root": {
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "15px",
        lineHeight: "16px",
        textAlign: "right",
        color: "rgba(255, 255, 255, 0.6)",
    },
}));

function UnStakeTemplate({
                                  tokenContractInfo,
                                  stakeContractInfo,
                                  amount
                              }) {
    const classes = useStyles();

    const web3 = useSelector(web3Selector);
    const account = useSelector(accountSelector);

    const [isUnStaking, setIsUnStaking] = useState(false);
    const [unStakingSuccessFul, setUnstakingSuccessful] = useState(false);
    const [unstakingErrored, setUnstakingErrored] = useState(false);


    const unStakeNow = async () => {
        try {
            setIsUnStaking(true);
            const unstakeTokenStatus = await unStakeToken(stakeContractInfo.contract,amount, web3, account);
            setUnstakingSuccessful(unstakeTokenStatus.success);
            if(!unstakeTokenStatus.success) {
                setUnstakingErrored(true);
            }
            setIsUnStaking(false);
        } catch (Err) {
            setIsUnStaking(false);
        }
    }


    return <Box>
        <Grid container>
            <Grid xs={12}>
                &nbsp;
            </Grid>
            <Grid xs={12} sx={{
                border: "1px solid #565656",
                boxSizing: "border-box",
                filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
                borderRadius: "16px",
                margin: "30px"
            }
            }>
                <Grid container>
                    <Grid xs={12} sx={{padding: "2%"}}>
                        <ReceivingAmountLabel>
                            Total Receiving Amount
                        </ReceivingAmountLabel>
                    </Grid>
                    <Grid xs={6} sx={{padding: "0 0 0 7%"}}>
                        <img className={classes.cestaLogo} src={CestaLogo} alt=""/> <Typography component={"span"} sx={{
                        fontFamily: "Inter",
                        fontStyle: "normal",
                        fontWeight: "normal",
                        fontSize: "18px",
                        textAlign: "center",
                        position: "absolute",
                        padding: "0 0 0 5px",
                        color: "rgba(255, 255, 255, 0.6)"
                    }}>CESTA</Typography>
                    </Grid>
                    <Grid xs={6} sx={{padding: "0 7% 0 0"}}>
                        <TokenAmount>~ {amount}</TokenAmount>
                    </Grid>
                    <Grid xs={12}>
                        <hr className={classes.hrBreak}/>
                    </Grid>
                    <Grid xs={6} sx={{padding: "0 0 10px 7%"}}>
                        <InfoText>
                            Unstake Amount
                        </InfoText>
                    </Grid>
                    <Grid xs={6} sx={{padding: "0 7% 0 0 "}}>
                        <InfoTextValue>
                            120 gCESTA
                        </InfoTextValue>
                    </Grid>
                    <Grid xs={6} sx={{padding: "0 0 10px 7%"}}>
                        <InfoText>
                            Unstake Penalty <Tooltip title={"Penalty For Unstaking"}>
                            <InfoIcon sx={{
                                position: "absolute",
                                height: "18px",
                            }}/>
                        </Tooltip>
                        </InfoText>
                    </Grid>
                    <Grid xs={6} sx={{padding: "0 7% 0 0"}}>
                        <InfoTextValue>
                            12%
                        </InfoTextValue>
                    </Grid>
                </Grid>
            </Grid>
            <Grid xs={12}>
                &nbsp;
            </Grid>
        </Grid>
        {unStakingSuccessFul && <Grid container>
            <Grid xs={12} sx={{
                textAlign: "center"}
            }>
                <img src={Done} alt=""/>
            </Grid>
            <Grid xs={12} sx={{
                textAlign: "center"}
            }>
                Unstaked Successfully
            </Grid>
        </Grid>}

        {unStakingSuccessFul && <Grid container>
            <Grid xs={12} sx={{
                textAlign: "center"}
            }>
                <img src={Errored} alt=""/>
            </Grid>
            <Grid xs={12} sx={{
                textAlign: "center"}
            }>
                Failed to approve transaction. <br/>Please try again.
            </Grid>
        </Grid>}

         <StyledButton onClick={unStakeNow} disabled={isUnStaking}>
            Unstake
        </StyledButton>
    </Box>
}

export default UnStakeTemplate;