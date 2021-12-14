import React, {Fragment, useEffect} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
    DialogTitle as MuiDialogTitle,
    DialogContent as MuiDialogContent,
    // DialogActions as MuiDialogActions,
    Typography,
    IconButton,
    Dialog,
    Button, CircularProgress, Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    makeStyles
} from '@mui/styles';
import {
    networkMap,
    ChainID,
} from '../../Constants/mains';
import {useSelector} from "react-redux";
import {networkIdSelector} from '../../store/selectors/web3.js';
import {
    CapitalizeFirstLetter
} from "../../Util/textUtil";

const DialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <MuiDialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
};

const DialogContent = styled(MuiDialogContent)(({theme}) => ({
    '&.MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
}));

const DialogMain = styled(Dialog)(({theme}) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiDialog-paper': {
        background: '#0F1322',
        borderRadius: '16px',
        border: "1px solid rgba(75, 134, 242, 0.5)" ,
        width: "100%"
    }
}));

const ButtonStyle = styled(Button)(({theme}) => ({
    '&.MuiButton-root': {
        background: "none",
        border: "1px solid rgba(75, 134, 242, 0.5)",
        borderRadius: "13px",
        width: "100%",
        height: "52px",
        cursor: "pointer",
        justifyContent: "start",
        '&:hover': {
            background: "#4B86F2"
        }
    },
}));

const useStyles = makeStyles((theme) => ({
    networkName: {
        fontFamily: "Rubik",
        fontStyle: "normal",
        fontWeight: "normal",
        display: "flex",
        color: "#FFFFFF",
        marginLeft: "20px"
    },
    selectWalletHeader: {
        display: "flex",
        color: "#4B86F2",
        "&.MuiTypography-root":{
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: "20px",
        }
    },
    selectWalletMessage: {
        alignItems: "center",
        "&.MuiTypography-root": {
            fontStyle: "normal",
            color: "#FFFFFF",
            fontWeight: "bold"
        }
    },
    selectWalletMessageNetworkName: {
        alignItems: "center",
        color: "#4B86F2",
        "&.MuiTypography-root": {
            fontWeight: "bold",
        }
    },
    networkLogo: {
        height: "14px",
        position: "absolute",
        marginRight: "41%"
    },
    selectedNetwork: {
        background: "#375894 !important"
    }
}));

const NetworkName = styled(Typography)(({theme}) => ({
    color: "#FFFFFF",
    "&.MuiTypography-root": {
        marginLeft: "20px",
        fontWeight: "bold",
        "&:first-letter":{
            textTransform: "capitalize"
        }
    }
}));

const mainnet = [
    "avalanche",
]
const Networks = Object.values(networkMap).filter(n => mainnet.includes(n));

function NetworkSelection({
    open, handleClose, networkImages,
    title
                          }) {

    const classes = useStyles();

    const networkId = useSelector(networkIdSelector);

    const changeNetwork = async (networkName) => {
        let networkStringName = networkName.toUpperCase();
        let netAddress  = ChainID[networkStringName]?ChainID[networkStringName].toString(): null;
        if(!netAddress) {
            return;
        }
        netAddress = (+netAddress).toString(16);
        netAddress = '0x' + netAddress;
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: netAddress }], // chainId must be in hexadecimal numbers
        });
        handleClose();
    }   

    const getWidthPercentage = () => {
        let win = window,
            doc = document,
            docElem = doc.documentElement,
            body = doc.getElementsByTagName('body')[0],
            x = win.innerWidth || docElem.clientWidth || body.clientWidth;

        if(x> 1600) {
            return '35%'
        } else if(x> 1200) {
            return '50%'
        }else if(x> 800) {
            return '75%'
        } else {
            return '85%'
        }
    }

    return <Fragment>
        <DialogMain
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}>
            {!title ? <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                <Typography variant="body1" className={classes.selectWalletHeader}>
                    Select Network
                </Typography>
                <Typography component="span" className={classes.selectWalletMessage}>
                    Currently you are using
                </Typography>
                <Typography component="span" className={classes.selectWalletMessageNetworkName}>
                    &nbsp;{CapitalizeFirstLetter(networkMap[networkId])}&nbsp;
                </Typography>
                <Typography component="span" className={classes.selectWalletMessage}>
                    network
                </Typography>
            </DialogTitle> : <DialogTitle id="customized-dialog-title">
                <Typography variant="body1" className={classes.selectWalletHeader}>
                    You are in unsupported network
                </Typography>
                <Typography component="span" className={classes.selectWalletMessage}>
                    Please select network from below
                </Typography>
            </DialogTitle>}

            <DialogContent dividers>
                <Grid
                    container
                    direction="row"
                    spacing={3}
                    sx={{ padding: "15px 0px" }}
                >
                    {Networks.map((network, index) => {
                        return <Grid item key={index}
                            xs={12} sm={6}
                        >
                            <ButtonStyle
                                key={network}
                                className={network === networkMap[networkId] ? classes.selectedNetwork : ''}
                                onClick={() => changeNetwork(network)}
                            >
                                <img src={networkImages[network]} alt="" className={classes.networkLogo} />

                                <NetworkName variant="body1">
                                    {CapitalizeFirstLetter(network)}
                                </NetworkName>
                            </ButtonStyle>
                        </Grid>
                    })}
                </Grid>
            </DialogContent>
        </DialogMain>
    </Fragment>

}

export default NetworkSelection;