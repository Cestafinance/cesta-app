import {Fragment, useState} from 'react';

import {Grid, Box, TextField, Button } from '@mui/material';
import {styled, makeStyles} from '@mui/styles';
import {
    scales
} from '../../Constants/utils';

const useStyles = makeStyles(({theme}) => ({
    assetScaleLabel: {
        margin: '20px'
    },
    assetMaxlabel: {
        marginLeft: '20px'
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
        borderRadius: '16px'
    }
}))

function Deposit({}) {

    const classes = useStyles();

    return <Box sx={{color: 'white'}}>
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
                <StyledTextField error={false}/>
                <Box sx={{
                    position: 'absolute',
                    float: 'right'
                }}>
                    USDT
                </Box>
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
                <StyledButton variant={'contained'}>Deposit</StyledButton>
            </Grid>
        </Grid>

    </Box>

}

export default Deposit;