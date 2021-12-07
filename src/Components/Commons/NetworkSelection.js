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
        background: "rgba(13, 153, 184, 0.2)",
        borderRadius: "13px",
        width: "100%",
        height: "52px",
        cursor: "pointer",
        justifyContent: "start",
        '&:hover': {
            background: "rgba(0, 209, 255,0.5)"
        }
    },
}));

const useStyles = makeStyles((theme) => ({
    networkName: {
        fontFamily: "Ambit",
        fontStyle: "normal",
        fontWeight: "normal",
        display: "flex",
        color: "#FFFFFF",
        marginLeft: "20px"
    },
    selectWalletHeader: {
        fontFamily: "Ambit",
        fontStyle: "normal",
        fontWeight: "bold",
        display: "flex",
        color: "#00D1FF",
    },
    selectWalletMessage: {
        fontFamily: "Ambit",
        fontStyle: "normal",
        fontWeight: "normal",
        alignItems: "center",
        color: "#FFFFFF",
    },
    selectWalletMessageNetworkName: {
        fontFamily: "Ambit",
        fontStyle: "normal",
        fontWeight: "normal",
        alignItems: "center",
        color: "#00D1FF",
    },
    networkLogo: {
        height: "14px",
        position: "absolute",
        marginRight: "41%"
    },
    selectedNetwork: {
        background: "#0D99B8"
    }
}));

const NetworkName = styled(Typography)(({theme}) => ({
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "normal",
    display: "flex",
    color: "#FFFFFF",
    marginLeft: "20px"
}));

const Networks = Object.values(networkMap);

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
            {!title ?<DialogTitle id="customized-dialog-title" onClose={handleClose}>
                <Typography variant="body1" className={classes.selectWalletHeader}>
                    Select Network
                </Typography>
                <Typography component="span" className={classes.selectWalletMessage}>
                    Currently You are using
                </Typography>
                <Typography component="span" className={classes.selectWalletMessageNetworkName}>
                    &nbsp;{networkMap[networkId]}&nbsp;
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
            <DialogContent dividers >
                <Grid container spacing={2}>
                    <Grid item xs={1}>
                    </Grid>
                    <Grid item xs={10}>
                        <Grid
                            container
                            direction="row"
                            spacing={3}
                        >
                            {Networks.map((network, index) => {
                                return <Grid item key={index}
                                             xs={12} sm={6}
                                >
                                    <ButtonStyle
                                        key={network}
                                        className={network === networkMap[networkId]? classes.selectedNetwork: ''}
                                        onClick={() => changeNetwork(network)}
                                    >
                                        <img src={networkImages[network]} alt="" className={classes.networkLogo}/>

                                        <NetworkName variant="body1">
                                            {network}
                                        </NetworkName>
                                    </ButtonStyle>
                                </Grid>
                            })}
                        </Grid>
                    </Grid>
                    <Grid item xs={1}>
                    </Grid>
                </Grid>
            </DialogContent>
        </DialogMain>
    </Fragment>

}

export default NetworkSelection;