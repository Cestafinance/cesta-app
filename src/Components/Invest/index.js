import {Fragment} from 'react';
import {
    useSelector
} from 'react-redux';
import {
    networkIdSelector
} from '../../store/selectors/web3';
import {makeStyles} from '@mui/styles';
import {useTheme} from '@mui/material/styles';


import {
    TableContainer,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Grid
} from '@mui/material';
import {styled} from "@mui/material/styles";
import Strategy from "./Strategy";

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        background: theme.palette.app.main,
        width: `100%`,
        color: "white",
        padding: "60px 0px 0px 240px",
        [theme.breakpoints.down('sm')]: {
            width: `96%`,
            padding: "60px 0px 0px 0"
        }
    }
}));

const StyledTableCell = styled(TableCell)(({theme}) => ({
    color: "white"
}));

const StyledTableContainer = styled(TableContainer)(({theme}) => ({
    '&.MuiPaper-root': {
        backgroundColor:  theme.palette.app.main,
        padding: '10px'
    }
}))

function Invest() {

    const networkId = useSelector(networkIdSelector);
    const classes = useStyles();
    const theme = useTheme();

    return <div className={classes.mainContainer}>
        <Grid container>
            <Grid xs={12}>
                &nbsp;
            </Grid>
            <Grid xs={12}>
                &nbsp;
            </Grid>
            <Grid xs={12}>
                &nbsp;
            </Grid>
            <Grid xs={12}>
                &nbsp;
            </Grid>
            <Grid xs={12}>
                <StyledTableContainer component={Paper}>
                    <Table sx={{backgroundColor: theme.palette.app.main, color: 'white'}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="left">Name</StyledTableCell>
                                <StyledTableCell align="left">Staked</StyledTableCell>
                                <StyledTableCell align="left">Liquidity</StyledTableCell>
                                <StyledTableCell align="left">ROI</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow
                                key={'test'}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell colSpan={4}>
                                    <Strategy/>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </StyledTableContainer>
            </Grid>
        </Grid>
    </div>

}

export default Invest