import { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Button,
    Checkbox,
    CircularProgress,
} from "@mui/material";
import {useSelector} from "react-redux";
import { makeStyles, styled } from "@mui/styles";
import Decimal from "decimal.js";
import {web3Selector, sourceSelector, accountSelector} from "../../../store/selectors/web3";
import {
    unStakeToken
} from "../../../store/interactions/stake";
import Done from "../../../assets/commons/done.png";
import Errored from "../../../assets/commons/errored.png";

const StyledButton = styled(Button)(({ theme }) => ({
    "&.MuiButton-root": {
        background: theme.palette.primary.main,
        width: "100%",
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

function UnStakeTemplate({
                                  tokenContractInfo,
                                  stakeContractInfo,
                                  amount
                              }) {

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