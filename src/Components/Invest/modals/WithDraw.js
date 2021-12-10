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
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '10px',
    lineHeight: '12px',
    color: 'rgba(255, 255, 255, 0.61)',
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
        }

    }

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
                    <Grid item xs={12}>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{
                            textAlign: 'center'
                        }}>
                            *Final amount might differ after
                        </Box>
                        <Box sx={{
                            textAlign: 'center'
                        }}>
                            the 20% profit sharing fee
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>

        <Box sx={{
            width: '86%',
            marginLeft: '7%',
            padding: '15px'

        }}>
            {slippageWarningNeeded && <Box sx={{display: 'flex'}}>
                <Box>
                    <Checkbox onChange={(event) => {
                        SetSlippageAcceptance(event.target.checked);
                    }}/>
                </Box>
                <Box>
                    <Typography>
                        I understand that my deposit may experience high slippage due to low liqudity
                    </Typography>
                </Box>
            </Box>}

            {isWithdrawing && <Box sx={{display: 'flex', textAlign: 'center'}}>
                <Box sx={{width: '100%'}}>
                    Withdrawing your {symbol} <br/>
                    from {strategyInfo.name} <br/>
                </Box>
            </Box>}

            {withdrawCompleted && <Box sx={{display: 'flex', textAlign: 'center'}}>
                <Box sx={{width: '100%'}}>
                    Your {symbol} has been withdrawn <br/>
                    from {strategyInfo.name} <br/>
                    successfully.
                </Box>
            </Box>}

            {withdrawError && <Box sx={{display: 'flex', textAlign: 'center', color: 'red'}}>
                <Box sx={{width: '100%'}}>
                    Failed to withdraw {symbol} <br/>
                    from {strategyInfo.name}. <br/>
                    Please try again.
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