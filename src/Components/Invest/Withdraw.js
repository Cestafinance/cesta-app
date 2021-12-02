import {Fragment, useState} from 'react';

import {Grid, Box, TextField, Button } from '@mui/material';
import {styled, makeStyles} from '@mui/styles';
import {
    scales
} from '../../Constants/utils';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import USDT from '../../assets/tokens/USDT-logo.png';

const useStyles = makeStyles(({theme}) => ({
    assetScaleLabel: {
        margin: '20px'
    },
    assetMaxlabel: {
        marginLeft: '20px'
    },
    logoStableCoins: {
        height: '20px',
        marginTop: '2px'
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

                  }) {


    const classes = useStyles();

    const [openCoinSelection, SetOpenCoinSelecting] = useState(false);

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
                        Available: 10.0000 USDT
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12}>
                &nbsp;
            </Grid>
            <Grid item xs={12}>
                <StyledTextField error={false}/>
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
                        <img src={USDT} className={classes.logoStableCoins} alt=""/>
                    </Box>
                    <Box sx={{
                        position: 'absolute',
                        right: '75px',
                        marginLeft: 'auto',
                        marginTop: '-37px',
                        float: 'right'
                    }}>
                        USDT
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
                    {['USDT', 'USDC', 'DAI'].map((token) => {
                        return <Box sx={{
                            display: 'flex',
                            padding: '0 15px 0 15px',
                            cursor: 'pointer',
                            ":hover":{
                                background:  '#375894'
                            }
                        }}>
                            <Box sx={{
                                marginRight: '4px'
                            }}>
                                <img src={USDT} className={classes.logoStableCoins} alt=""/>
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
                            return <span className={index !== 4 ? classes.assetScaleLabel: classes.assetMaxlabel}>
                                {scale.label}
                            </span>
                        })}
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12}>
                &nbsp;
            </Grid>
            <Grid item xs={12}>
                <StyledButton variant={'contained'}>Withdraw</StyledButton>
            </Grid>
        </Grid>

    </Box>

}

export default WithDraw;