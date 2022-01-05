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
import {web3Selector, networkIdSelector, accountSelector} from "../../../store/selectors/web3";
import {
    checkAllowance,
    approveToken,
    depositStake
} from "../../../store/interactions/stake";
import {
    networkScanUrl
} from "../../../Constants/mains";
import Done from "../../../assets/commons/done.png";
import Errored from "../../../assets/commons/errored.png";
import Link from "../../../assets/commons/link.png";

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

function DepositStakeTemplate({
    tokenContractInfo,
    stakeContractInfo,
    amount
                              }) {

    const web3 = useSelector(web3Selector);
    const account = useSelector(accountSelector);
    const networkId = useSelector(networkIdSelector);

    const [needApproval, setNeedApproval] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [approveSuccessful, setApproveSuccessful] = useState(false);
    const [approvalErrored, setIsApprovalErrored] = useState(false);
    const [isStaking, setIsStaking] = useState(false);
    const [stakingSuccessFul, setStakingSuccessful] = useState(false);
    const [stakingErrored, setStakingErrored] = useState(false);
    const [transactionHash, setTransactionHash] = useState("");


    const checkApprovalNeeded = async () => {
        debugger;
        const needApprovalStatus = await checkAllowance(tokenContractInfo.contract, stakeContractInfo.address, account, web3, amount);
        setNeedApproval(needApprovalStatus.needApproval);
    }

    const approve = async () => {
        try {
            setIsApproving(true);
            const {success} = await approveToken(tokenContractInfo.contract, stakeContractInfo.address, account, web3);
            setIsApproving(false);
            if(success) {
                setApproveSuccessful(true);
            } else {
                setIsApprovalErrored(true);
            }
        } catch (Err) {
            setIsApproving(false);
        }
    }

    const stakeNow = async () => {
        try {
            setIsStaking(true);
            setStakingSuccessful(false);
            setStakingErrored(false);
            const decimalAmount = new Decimal(amount).mul(new Decimal(10).pow(tokenContractInfo.decimals)).toString();
            const txDetails = await depositStake(stakeContractInfo.contract, account, web3, decimalAmount);
            setIsStaking(false);
            setStakingSuccessful(txDetails.success);
            if(!txDetails.success) {
                setStakingErrored(true);
            } else {
                setTransactionHash(txDetails.receipt.transactionHash);
            }
        } catch (Err) {
            setIsStaking(false);
            setStakingErrored(true);
        }
    }

    useEffect(() => {
        checkApprovalNeeded();
    }, []);

    return <Box>
        {needApproval && <StyledButton onClick={approve} disabled={isApproving}>
            {isApproving?<CircularProgress color="secondary"  size={20} />:"Approve"}
        </StyledButton>}
        {approveSuccessful && <Grid container>
            <Grid xs={12} sx={{
                textAlign: "center"}
            }>
                <img src={Done} alt=""/>
            </Grid>
            <Grid xs={12} sx={{
                textAlign: "center"}
            }>
                Transaction approved successfully
            </Grid>
        </Grid>}

        {approvalErrored && <Grid container>
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

        {!needApproval && <StyledButton onClick={stakeNow} disabled={isStaking}>
            {isStaking? <CircularProgress color="secondary"  size={20} /> : "Stake"}
        </StyledButton>}

        {stakingSuccessFul && <Grid container>
            <Grid xs={12} sx={{
                textAlign: "center"}
            }>
                <img src={Done} alt=""/>
            </Grid>
            <Grid xs={12} sx={{
                textAlign: "center"}
            }>
                Transaction approved successfully
            </Grid>

            <Grid xs={12} sx={{
                textAlign: "center"}
            }>
                <a href={`${networkScanUrl[networkId]}/tx/${transactionHash}`} target="__blank"><img src={Link} alt=""/> View On explorer</a>
            </Grid>
        </Grid>}

        {stakingErrored && <Grid container>
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
    </Box>
}

export default DepositStakeTemplate;