import {Box, Button, Checkbox, CircularProgress, Grid, Typography} from '@mui/material';
import {makeStyles, styled} from '@mui/styles';
import {useState} from 'react';
import {useTokenMinPriceWithdraw} from '../TokenMinPrice/hooks';
import {
    withdrawTokenThreeParam
} from '../../../store/interactions/vaults';
import DoneMark from '../../../assets/commons/done.png';
import fromExponential from 'from-exponential';

const LabelMessage = styled(Typography)(({theme}) => ({
    lineHeight: '12px',
    color: 'rgba(255, 255, 255, 0.61)',
    '&.MuiTypography-root': {
        fontSize: '14px',
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: 'normal',    
    }
}));

const DepositButton = styled(Button)(({theme}) => ({
    '&.MuiButton-root': {
        background: '#4B86F2',
        borderRadius: '33px',
        width: '75%',
        marginTop: "24px",
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
        // marginTop: '3px'
    }
}));

function WithdrawTemplate({
                              amount,
                              shares,
                              symbol,
                              logo,
                              stableCoinsContractData,
                              strategyInfo,
                              vault,
                              account,
                              getShareAndUSDValue,
                              closeDialog
                          }) {

    const classes = useStyles();

    const [isWithdrawing, SetIsWithdrawing] = useState(false);
    const [withdrawCompleted, SetWithdrawCompleted] = useState(false);
    const [withdrawError, SetWithdrawError] = useState(false);
   
    const [slippageWarningNeeded, SetSlippageWarningNeeded] = useState(true);
    const [slippageAccepted, SetSlippageAcceptance] = useState(false);
    const {getTokenPriceMin} = useTokenMinPriceWithdraw()

    const withDrawNow = async () => {
        SetWithdrawError(false);
        SetIsWithdrawing(true);

        // To prevent "1.2e+21" being passed into withdraw function, should be "1200000000000000000000" instead
        const finalSharesToWithdraw = fromExponential(shares);
    
        const tokenMinPrice = await getTokenPriceMin({
            strategy: strategyInfo,
            withdrawERC20Address: stableCoinsContractData.address,
            shareToWithdraw: finalSharesToWithdraw
        });

        const status = await withdrawTokenThreeParam(vault.contract, finalSharesToWithdraw , stableCoinsContractData.address, tokenMinPrice, account);

        SetIsWithdrawing(false);
        if(status.success) {
            SetWithdrawCompleted(true);
            SetWithdrawError(false);
            getShareAndUSDValue();
            setTimeout(() => {
                closeDialog();
            }, 2000)
        } else {
            SetWithdrawError(true);
            SetSlippageWarningNeeded(true);
            SetSlippageAcceptance(false);
        }

    }

    return <Box sx={{color: 'rgb(255,255,255, 0.6)', fontFamily: "Inter"}}>
        <Box sx={{
            width: '86%',
            background: 'none',
            borderRadius: '16px',
            border: "1px solid #565656",
            marginLeft: '7%',
            padding: '15px'
        }}>
            <Box sx={{
                textAlign: 'center',
                marginBottom: "16px"
            }}>
                <LabelMessage>
                    Kindly approve the transaction in your wallet
                </LabelMessage>
            </Box>

            <Box>
                <Grid container>
                    <Grid item xs={12}>
                    </Grid>

                    {/** Withdraw Currency and Amount */}
                    <Grid container style={{marginBottom: "16px", marginTop:"8px"}}>
                        <Grid item xs={6}>
                            <Box sx={{display: "flex", alignItems: "center"}}>
                                <img src={logo} className={classes.logo} alt=""/>
                                <span style={{marginLeft: "8px", fontSize: "16px"}}>{symbol}</span>
                            </Box>
                        </Grid>
                        <Grid item xs={6} className={classes.alignRight}>
                            <span style={{fontSize:"16px"}}>{amount}</span>
                        </Grid>
                    </Grid>
                   
                    <Grid item xs={12}>
                        <hr/>
                    </Grid>
                    <Grid item xs={12}>
                    </Grid>
                    
                    <Grid item xs={12} sx={{textAlign: 'center', lineHeight: "1.2", margin: "16px 0px", fontSize: "14px"}}>
                        <span> *Final amount might differ after </span>
                        <span style={{display: "block"}}> the 20% profit sharing fee </span>
                    </Grid>
                </Grid>
            </Box>
        </Box>

        <Box sx={{
            width: '86%',
            marginLeft: '7%',
            padding: "15px 0px"
        }}>
            {slippageWarningNeeded && !isWithdrawing && !withdrawCompleted && <Box sx={{display: 'flex'}}>
                <Box>
                    <Checkbox sx={{ color: "rgb(255,255,255, 0.6)", paddingLeft: "0px", paddingTop:"0px"}} onChange={(event) => {
                        SetSlippageAcceptance(event.target.checked);
                    }}/>
                </Box>
                <Box>
                    <Typography sx={{fontSize: "14px"}}>
                        I understand that my deposit may experience high slippage due to low liqudity
                    </Typography>
                </Box>
            </Box>}

            {isWithdrawing && <Box sx={{display: 'flex', textAlign:"center", fontSize:"14px",  marginTop: "16px"}}>
                <Box sx={{width: '100%'}}>
                    Withdrawing your {symbol} from {strategyInfo.name}
                </Box>
            </Box>}

            {withdrawCompleted && <Box sx={{display: 'flex', textAlign: 'center', fontSize:"14px",  marginTop: "16px"}}>
                <Box sx={{width: '100%'}}>
                    Your {symbol} has been withdrawn from {strategyInfo.name} successfully.
                </Box>
            </Box>}

            {withdrawError && <Box sx={{display: 'flex', color: 'red', fontSize:"14px", fontWeight: "bold", marginTop: "16px"}}>
                <Box sx={{width: '100%'}}>
                    Failed to withdraw {symbol} from {strategyInfo.name}. 
                    <span style={{display:"block"}}>Please try again.</span>
                </Box>
            </Box>}

            <Box sx={{textAlign: 'center'}}>
                <DepositButton disabled={slippageWarningNeeded && !slippageAccepted} onClick={withDrawNow}>
                    {isWithdrawing ? <CircularProgress size={20}/> : withdrawCompleted ? <img src={DoneMark} alt="Done"/>:'WITHDRAW'}
                </DepositButton>
            </Box>

        </Box>
    </Box>
}

export default WithdrawTemplate;