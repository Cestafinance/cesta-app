import {Box, Button, Checkbox, CircularProgress, Grid, Typography} from '@mui/material';
import {makeStyles, styled} from '@mui/styles';
import {useState} from 'react';
import {useTokenMinPriceWithdraw} from '../TokenMinPrice/hooks';
import {
    withdrawTokenThreeParam
} from '../../../store/interactions/vaults';

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
                              account
                          }) {

    const classes = useStyles();

    const [isWithdrawing, SetIsWithdrawing] = useState(false);
   
    const [slippageWarningNeeded, SetSlippageWarningNeeded] = useState(true);
    const [slippageAccepted, SetSlippageAcceptance] = useState(false);
    const {getTokenPriceMin} = useTokenMinPriceWithdraw()

    const withDrawNow = async () => {

        SetIsWithdrawing(true);

        const tokenMinPrice = await getTokenPriceMin({
            strategy: strategyInfo,
            withdrawERC20Address: stableCoinsContractData.address,
            shareToWithdraw: shares.toString()
        });

        const status = await withdrawTokenThreeParam(vault.contract, shares.toString() , stableCoinsContractData.address, tokenMinPrice, account);

        SetIsWithdrawing(false);

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

            <Box sx={{textAlign: 'center'}}>
                <DepositButton disabled={slippageWarningNeeded && !slippageAccepted} onClick={withDrawNow}>
                    {isWithdrawing ? <CircularProgress size={20}/> : 'WITHDRAW'}
                </DepositButton>
            </Box>

        </Box>
    </Box>
}

export default WithdrawTemplate;