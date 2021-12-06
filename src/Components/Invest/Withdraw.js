import {Fragment, useEffect, useState} from 'react';
import {
    useSelector
} from 'react-redux';
import {Grid, Box, TextField, Button } from '@mui/material';
import {styled, makeStyles} from '@mui/styles';
import {
    scales
} from '../../Constants/utils';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
    getDepositAmountFromContract,
    getPricePerFullShare
} from '../../store/interactions/vaults';
import {
    getWalletAmount
} from '../../store/interactions/stableCoins';
import {
    accountSelector,
    web3Selector
} from '../../store/selectors/web3';
import {stableCoinsSelector} from "../../store/selectors/commons";
import ActionConfirm from './modals/Modal';
import WithdrawTemplate from './modals/WithDraw';

const useStyles = makeStyles(({theme}) => ({
    assetScaleLabel: {
        margin: '20px',
    },
    assetMaxlabel: {
        marginLeft: '20px',
    },
    logoStableCoins: {
        height: '20px',
        marginTop: '2px'
    },
    selectedPercentage: {
        background: '#375894',
        borderRadius: '32px',
        padding: '2px'
    }
}));

const StyledTextField = styled(TextField)(({theme}) => ({
    '&.MuiTextField-root': {
        width: '100%',
        background: '#1B203C',
        borderRadius: '20px',
        boxSizing: 'border-box',

    },
    '& .MuiInputBase-root': {
        background: '#1B203C',
        boxSizing: 'border-box',
        borderRadius: '20px',
        width: '100%',
        color: '#FFFFFF'

    },
    '&.Mui-error': {
        borderRadius: '20px',
    }
}));

const StyledButton = styled(Button)(({theme}) => ({
    '&.MuiButton-root': {
        background: theme.palette.primary.main,
        width: '100%',
        boxShadow: 'none',
        borderRadius: '16px',
        zIndex: 4
    }
}))


function WithDraw({
                      strategyData,
                      vaultContract,
                      coinBalances,
                      stableCoinLogos
                  }) {


    const classes = useStyles();

    const [openCoinSelection, SetOpenCoinSelecting] = useState(false);
    const [depositedShares, SetDepositedShares] = useState(0);
    const [depositedAmount, SetDepositedAmount] = useState(0);
    const [selectedCoinIndex, SetSelectedCoinIndex] = useState(0);
    const [amountToWithdraw, SetAmountToWithdraw] = useState(0);
    const [selectedPercentage, SetSelectedPercentage] = useState(null);
    const [toWithdrawShares, SetToWithdrawShares] = useState(0);
    const [open, SetOpen] = useState(false);

    const account = useSelector(accountSelector);
    const web3 = useSelector(web3Selector);
    const stableCoinsContracts = useSelector(stableCoinsSelector);

    const getShareAndUSDValue = async () => {
        try {
            let strategyBalance = await getWalletAmount(vaultContract.contract, account);
            strategyBalance = parseFloat((strategyBalance / (10 ** strategyData.decimals)).toFixed(8))
            SetDepositedShares(strategyBalance);

            let vaultPricePerFullShare = await getPricePerFullShare(vaultContract.contract);

            let depositPendingAmount = await getDepositAmountFromContract(vaultContract.contract, account)

            let strategyBalanceInUSD = strategyBalance * vaultPricePerFullShare;
            SetDepositedAmount(parseFloat(strategyBalanceInUSD.toFixed(4)));
        } catch (Err) {

        }
    }

    const selectPercentage = (value) => {

        const amt = depositedAmount * (value /100);
        SetAmountToWithdraw(amt.toFixed(4));
        SetSelectedPercentage(value);

    }

    useEffect(() => {
        getShareAndUSDValue();
    }, []);

    const onInputChange = (value) => {
        let decimals = value.match(/\./g)
        if(decimals && decimals.length > 1) {
            return value;
        }

        if((decimals && decimals.length ===1 && value[value.length-1]==='.') || value[value.length-1]==='0') {
            SetAmountToWithdraw(value);
            return;
        }
        let newVal = parseFloat(value)
        SetAmountToWithdraw(isNaN(newVal)? 0 : newVal);
    }

    const handleClose = () => {
        SetOpen(false);
    }

    const withdrawNow = async () => {
        const ratio = (amountToWithdraw/depositedAmount);
        const sharesToExit  = (ratio * depositedShares).toFixed(4);
        SetToWithdrawShares(sharesToExit * (10 ** strategyData.decimals));
        SetOpen(true);
    }

    return  <Box sx={{color: 'white'}}>
        <Grid container>
            <Grid item xs={12}>&nbsp;</Grid>
            <Grid item xs={12}>
                <Box mt={2} sx={{
                    display: 'flex'
                }}>
                    Deposit
                </Box>
            </Grid>

            <Grid item xs={12}>
                <Box sx={{
                    display: 'flex'

                }}>
                    <Box sx={{
                        width: '50%'
                    }}>
                        Deposit funds into this strategy.
                    </Box>
                    <Box sx={{
                        width: '50%',
                        textAlign: 'end'
                    }}>
                        Available: {depositedAmount} {strategyData.tokens[selectedCoinIndex]}
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12}>
                &nbsp;
            </Grid>
            <Grid item xs={12}>
                <StyledTextField
                    onChange={(e) => onInputChange(e.target.value)}
                    value={amountToWithdraw}
                    error={false}/>
                <Box sx={{
                    cursor: 'pointer'
                }} onClick={() => SetOpenCoinSelecting(!openCoinSelection)}>
                    <Box sx={{
                        position: 'absolute',
                        right: '125px',
                        marginLeft: 'auto',
                        marginTop: '-38px',
                        float: 'right'
                    }}>
                        <img src={stableCoinLogos[strategyData.tokens[selectedCoinIndex]]}
                             className={classes.logoStableCoins} alt=""/>
                    </Box>
                    <Box sx={{
                        position: 'absolute',
                        right: '75px',
                        marginLeft: 'auto',
                        marginTop: '-37px',
                        float: 'right'
                    }}>
                        {strategyData.tokens[selectedCoinIndex]}
                    </Box>
                    <Box sx={{
                        position: 'absolute',
                        right: '50px',
                        marginLeft: 'auto',
                        marginTop: '-39px',
                        float: 'right'
                    }}>
                        <ArrowDropDownIcon/>
                    </Box>
                </Box>
                {openCoinSelection && <Box sx={{
                    position: 'absolute',
                    right: '60px',
                    marginLeft: 'auto',
                    marginTop: '-10px',
                    float: 'right',
                    padding: '15px 0 15px 0px',
                    background: '#191E2C',
                    zIndex: 5,
                    borderRadius: '24px'

                }}>
                    {strategyData.tokens.map((token, index) => {
                        return <Box
                            onClick={() => SetSelectedCoinIndex(index)}
                            key={index}
                            sx={{
                                display: 'flex',
                                padding: '0 15px 0 15px',
                                cursor: 'pointer',
                                ":hover": {
                                    background: '#375894'
                                }
                            }}>
                            <Box sx={{
                                marginRight: '4px'
                            }}>
                                <img src={stableCoinLogos[token]} className={classes.logoStableCoins} alt=""/>
                            </Box>
                            <Box sx={{
                                marginLeft: '5px'
                            }}>
                                {token}
                            </Box>
                        </Box>
                    })}
                </Box>}
            </Grid>
            <Grid item xs={12}>
                <Box sx={{
                    display: 'flex'
                }}>
                    <Box sx={{
                        width: '50%'
                    }}>
                    </Box>
                    <Box sx={{
                        width: '50%',
                        textAlign: 'end'
                    }}>
                        {scales.map((scale, index) => {
                            return <span className={(index !== 4 ? classes.assetScaleLabel: classes.assetMaxlabel) + ' ' + (selectedPercentage === scale.value? classes.selectedPercentage: '')} onClick={() => selectPercentage(scale.value)}>
                                {scale.label}
                            </span>
                        })}
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12}>
                &nbsp;
                <ActionConfirm
                    open={open}
                    handleClose={handleClose}
                    titleMain={'Confirm Withdrawal'}
                    subTitle={`from ${strategyData.name}`}
                    content={<WithdrawTemplate
                        strategyInfo={strategyData}
                        amount={amountToWithdraw}
                        shares={toWithdrawShares}
                        vault={vaultContract}
                        logo={stableCoinLogos[strategyData.tokens[selectedCoinIndex]]}
                        stableCoinsContractData={stableCoinsContracts[strategyData.erc20addresses[selectedCoinIndex].toLowerCase()]}
                        account={account}
                        symbol={strategyData.tokens[selectedCoinIndex]}/>}
                />
            </Grid>
            <Grid item xs={12}>
                <StyledButton onClick={withdrawNow} variant={'contained'}>Withdraw</StyledButton>
            </Grid>
        </Grid>

    </Box>

}

export default WithDraw;