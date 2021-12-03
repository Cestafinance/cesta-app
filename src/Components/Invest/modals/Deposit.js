import {
    useEffect,
    useState
} from 'react';
import {
    Box,
    Grid,
    Typography,
    Button,
    Tooltip,
    Checkbox,
    CircularProgress
} from '@mui/material';
import {makeStyles, styled} from '@mui/styles';
import {Info as InfoIcon} from '@mui/icons-material';
import {
    web3Selector
} from '../../../store/selectors/web3';
import {
    checkAllowance,
    approveToken
} from '../../../store/interactions/stableCoins';
import {
    calculateFee,
    depositToken
} from '../../../store/interactions/vaults';
import {useSelector} from "react-redux";

const LabelMessage = styled(Typography)(({theme}) => ({
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '10px',
    lineHeight: '12px',
    color: 'rgba(255, 255, 255, 0.61)',
}));

const ApproveButton = styled(Button)(({theme}) => ({
    '&.MuiButton-root': {
        background: '#4B86F2',
        borderRadius: '33px',
        width: '75%',
        color: '#FFFFFF',
        '&:hover': {
            background: 'rgba(75, 134, 242, 0.4)'

        }
    },
}));

const DepositButton = styled(Button)(({theme}) => ({
    '&.MuiButton-root': {
        background: '#4B86F2',
        borderRadius: '33px',
        width: '75%',
        color: '#FFFFFF',
        '&:hover': {
            background: 'rgba(75, 134, 242, 0.4)'

        }
    },
}));

const useStyles = makeStyles(({theme}) => ({
    alignRight: {
        textAlign: 'right'
    },
    toolTip: {
        height: '15px !important',
        marginBottom: '-2px',
        marginLeft: '-4px'
    },
    logo: {
        height: '17px',
        marginTop: '3px'
    }
}));


function DepositTemplate({
                             amount,
                             vault,
                             symbol,
                             logo,
                             stableCoinsContractData,
                             account,
                             strategyInfo
                         }) {

    const classes = useStyles();
    const [needStrategyApproval, SetNeedStrategyApproval] = useState(false);
    const [checkingForApproval, SetCheckingForApproval] = useState(false);
    const [calculatingFees, SetCalculatingFees] = useState(false);
    const [hasApproved, SetHasApproved] = useState(false);
    const [isApproving, SetIsApproving] = useState(false);
    const [isApprovalError, SetIsApprovalError] = useState(false);
    const [isDepositing, SetDepositing] = useState(false);
    const [depositError, SetDepositError] =useState(false);
    const [depositCompleted, SetDepositCompleted] = useState(false);
    const [feeInfo, SetFeeInformation] = useState({
        feePercentage: 0,
        fees: 0,
        finalAmount: 0
    });

    const web3 = useSelector(web3Selector);

    const checkAllowanceApprovalNeeded = async () => {
        SetCheckingForApproval(true);
        const isApprovalNeeded = await checkAllowance(stableCoinsContractData.contract, vault.address, account, web3, amount * (10 ** stableCoinsContractData.decimals));
        SetNeedStrategyApproval(isApprovalNeeded.needApproval);
        SetHasApproved(!isApprovalNeeded.needApproval);
        SetCheckingForApproval(false);
    }

    const getFeeInfo = async () => {
        SetCalculatingFees(true);
        const feeDataResponse = await calculateFee(vault.contract, strategyInfo.type, (amount * (10 ** stableCoinsContractData.decimals)));
        if (!feeDataResponse.success) {
            SetCalculatingFees(false);
            return null;
        }

        const feeAmount = (amount * feeDataResponse.feePercent / 100).toFixed(4);
        const finalAmount = (amount - feeAmount).toFixed(4);
        SetCalculatingFees(false);
        SetFeeInformation({
            feePercentage: feeDataResponse.feePercent,
            fees: feeAmount,
            finalAmount: finalAmount
        });
    }

    const approveAmount = async () => {
        SetIsApproving(true);
        const approvalData = await approveToken(stableCoinsContractData.contract, strategyInfo.vaultAddress, account, web3);
        SetIsApproving(false);
        SetHasApproved(approvalData.success);
        SetIsApprovalError(!approvalData.success)
    }

    const depositAmount = async () => {
        SetDepositing(true);
        const valueData = amount * (10 ** stableCoinsContractData.decimals);
        const depositStatus = await depositToken(vault.contract, valueData.toString(), stableCoinsContractData.address, account);
        SetDepositing(false);
        if(depositStatus.success) {
            SetDepositError(false);
            SetDepositCompleted(true);
        } else {
            SetDepositError(true);
            SetDepositCompleted(false);
        }
    }

    useEffect(() => {
        checkAllowanceApprovalNeeded();
        getFeeInfo();
    }, [])

    return <Box sx={{color: '#FFFFFF'}}>
        <Box sx={{
            width: '86%',
            background: 'rgba(75, 134, 242, 0.4)',
            borderRadius: '16px',
            marginLeft: '7%',
            padding: '15px'
        }}>
            <Box sx={{
                textAlign: 'center'
            }}>
                <LabelMessage>
                    Kindly approve the transaction in your wallet
                </LabelMessage>
            </Box>

            <Box>
                <Grid container>
                    <Grid item xs={12}>

                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{display: 'flex'}}>
                            <Box sx={{width: '10%'}}>
                                <img src={logo} className={classes.logo} alt=""/>

                            </Box>
                            <Box>
                                {symbol}
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={6} className={classes.alignRight}>
                        {amount}
                    </Grid>
                    <Grid item xs={12}>
                        <hr/>
                    </Grid>
                    <Grid item xs={6}>
                        Deposit
                    </Grid>
                    <Grid item xs={6} className={classes.alignRight}>
                        {feeInfo.finalAmount} {symbol}
                    </Grid>
                    <Grid item xs={6}>
                        Fee({feeInfo.feePercentage} %) <Tooltip className={classes.toolTip} title={'test'}
                                     placement='top-end'><InfoIcon/></Tooltip>
                    </Grid>
                    <Grid item xs={6} className={classes.alignRight}>
                        - {feeInfo.fees}
                    </Grid>
                    <Grid item xs={6}>
                        Total
                    </Grid>
                    <Grid item xs={6} className={classes.alignRight}>
                        {amount} {symbol}
                    </Grid>
                </Grid>
            </Box>
        </Box>

        <Box sx={{
            width: '86%',
            marginLeft: '7%',
            padding: '15px'

        }}>
            <Box sx={{display: 'flex'}}>
                <Box>
                    <Checkbox/>
                </Box>
                <Box>
                    <Typography>
                        I understand that my deposit may experience high slippage due to low liqudity
                    </Typography>
                </Box>

            </Box>
            {needStrategyApproval && <Box sx={{display: 'flex'}}>
                <Box sx={{width: '70%'}}>
                    Allow your USDT to be deposited
                    in Cuban’s Ape Strategy
                </Box>
                <Box sx={{width: '30%', textAlign: 'end'}}>
                    <ApproveButton onClick={approveAmount} disabled={isApproving}>
                        {isApproving?<CircularProgress size={20}/>: 'APPROVE'}
                    </ApproveButton>
                </Box>
            </Box>}
            <Box sx={{textAlign: 'center'}}>
                <DepositButton disabled={checkingForApproval || calculatingFees || !hasApproved} onClick={depositAmount}>
                    {isDepositing? <CircularProgress size={20}/>: 'DEPOSIT'}
                </DepositButton>
            </Box>

        </Box>
    </Box>
}

export default DepositTemplate;