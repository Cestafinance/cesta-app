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
import {styled} from '@mui/material/styles';
import {
    makeStyles
} from '@mui/styles';
import {
    networkMap,
    ChainID,
} from '../../Constants/mains';
import {useSelector} from "react-redux";
import {networkIdSelector, accountSelector} from '../../store/selectors/web3.js';
import {
    CapitalizeFirstLetter
} from "../../Util/textUtil";
import Warning from '../../assets/commons/warning.png';

const DialogTitle = (props) => {
    const {children, onClose, ...other} = props;

    return (
        <MuiDialogTitle sx={{m: 0, p: 2}} {...other}>
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
                    <CloseIcon/>
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
        border: "1px solid rgba(75, 134, 242, 0.5)",
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


const SelectNetworkButton = styled(Button)(({theme}) => ({
    '&.MuiButton-root': {
        background: "#4B86F2",
        border: "1px solid rgba(55, 88, 148, 0.2)",
        borderRadius: "12px",
        width: "50%",
        height: "40px",
        cursor: "pointer",
        justifyContent: "center",
        margin: "15px 0px",
        "&.MuiTypography-root": {
            marginLeft: "0px",
        },
        '&:hover': {
            background: "#4B86F2"
        }
    },
}));

const useStyles = makeStyles((theme) => ({
    networkName: {
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: "normal",
        display: "flex",
        color: "#FFFFFF",
        marginLeft: "20px"
    },
    selectWalletHeader: {
        display: "flex",
        color: "#4B86F2",
        "&.MuiTypography-root": {
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
        "&:first-letter": {
            textTransform: "capitalize"
        }
    }
}));

const SwitchNetworkName = styled(Typography)(({theme}) => ({
    color: "#FFFFFF",
    "&.MuiTypography-root": {
        fontWeight: "normal",
        fontFamily: "Inter",
        "&:first-letter": {
            textTransform: "capitalize"
        }
    }
}));

const WrongNetworkMessage = styled(Typography)(({theme}) => ({
    "&.MuiTypography-root": {
        color: "rgba(75, 134, 242, 1)",
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '20px',
        lineHeight: '14px',
        "&:first-letter": {
            textTransform: "capitalize"
        }
    }
}));

const SelectNetworkMessage = styled(Typography)(({theme}) => ({
    "&.MuiTypography-root": {
        color: "rgba(75, 134, 242, 1)",
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '18px',
        lineHeight: '14px',
        "&:first-letter": {
            textTransform: "capitalize"
        }
    }
}));

const CestaNetworkMessage = styled(Typography)(({theme}) => ({
    "&.MuiTypography-root": {
        color: "#FFFFFF",
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '18px',
        lineHeight: '18px',
    }
}));

const Network =  styled(Typography)(({theme}) => ({
    "&.MuiTypography-root": {
        color: "rgba(75, 134, 242, 1)",
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '18px',
        lineHeight: '18px',
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
        let netAddress = ChainID[networkStringName] ? ChainID[networkStringName].toString() : null;
        if (!netAddress) {
            return;
        }
        netAddress = (+netAddress).toString(16);
        netAddress = '0x' + netAddress;
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId: netAddress}], // chainId must be in hexadecimal numbers
        });
        handleClose();
    }

    const getWidthPercentage = () => {
        let win = window,
            doc = document,
            docElem = doc.documentElement,
            body = doc.getElementsByTagName('body')[0],
            x = win.innerWidth || docElem.clientWidth || body.clientWidth;

        if (x > 1600) {
            return '35%'
        } else if (x > 1200) {
            return '50%'
        } else if (x > 800) {
            return '75%'
        } else {
            return '85%'
        }
    }

    return <Fragment>
        <DialogMain
            onClose={(event, reason) => {
                if(reason !== 'backdropClick') {
                    handleClose()
                }
            }}
            aria-labelledby="customized-dialog-title"
            open={open}>
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            </DialogTitle>

            {!title ? <DialogContent dividers>
                <Grid
                    container
                    spacing={3}
                >
                    <Grid item xs={12} sx={{textAlign: 'center'}}>
                        <SelectNetworkMessage>
                            Select Network
                        </SelectNetworkMessage>
                    </Grid>
                    <Grid item xs={12} sx={{textAlign: 'center', paddingBottom: '10px !important'}}>
                        <CestaNetworkMessage  component={'span'}>
                            Currently You are Using <Network component={'span'}>{CapitalizeFirstLetter(networkMap[networkId])}</Network> Network
                        </CestaNetworkMessage>
                    </Grid>
                    <Grid item xs={12} sx={{textAlign: 'center'}}>
                        {Networks.map((network, index) => {
                            return <SelectNetworkButton
                                key={network}
                                className={network === networkMap[networkId] ? classes.selectedNetwork : ''}
                                onClick={() => changeNetwork(network)}
                            >
                                {/*<img src={networkImages[network]} alt="" className={classes.networkLogo}/>*/}

                                <CestaNetworkMessage variant="body1">
                                    Switch To {CapitalizeFirstLetter(network)} Mainnet
                                </CestaNetworkMessage>
                            </SelectNetworkButton>
                        })}
                    </Grid>
                </Grid>
                {/*<Grid*/}
                {/*    container*/}
                {/*    direction="row"*/}
                {/*    spacing={3}*/}
                {/*    sx={{padding: "15px 0px"}}*/}
                {/*>*/}
                {/*    {Networks.map((network, index) => {*/}
                {/*        return <Grid item key={index}*/}
                {/*                     xs={12} sm={6}*/}
                {/*        >*/}
                {/*            <ButtonStyle*/}
                {/*                key={network}*/}
                {/*                className={network === networkMap[networkId] ? classes.selectedNetwork : ''}*/}
                {/*                onClick={() => changeNetwork(network)}*/}
                {/*            >*/}
                {/*                <img src={networkImages[network]} alt="" className={classes.networkLogo}/>*/}

                {/*                <NetworkName variant="body1">*/}
                {/*                    {CapitalizeFirstLetter(network)}*/}
                {/*                </NetworkName>*/}
                {/*            </ButtonStyle>*/}
                {/*        </Grid>*/}
                {/*    })}*/}
                {/*</Grid>*/}
            </DialogContent> : <DialogContent dividers>
                <Grid
                    container
                    spacing={3}
                >
                    <Grid item xs={12} sx={{textAlign: 'center'}}>
                        <img src={Warning} alt=""/>
                    </Grid>
                    <Grid item xs={12} sx={{textAlign: 'center', paddingTop: '0px !important'}}>
                        <WrongNetworkMessage>
                            Wrong Network
                        </WrongNetworkMessage>
                    </Grid>
                    <Grid item xs={12} sx={{textAlign: 'center', paddingBottom: '10px !important'}}>
                        <CestaNetworkMessage>
                            Cesta.finance only works on Avalanche Mainnet.
                        </CestaNetworkMessage>
                    </Grid>
                    <Grid item xs={12} sx={{textAlign: 'center'}}>
                        {Networks.map((network, index) => {
                            return <SelectNetworkButton
                                key={network}
                                className={network === networkMap[networkId] ? classes.selectedNetwork : ''}
                                onClick={() => changeNetwork(network)}
                            >
                                {/*<img src={networkImages[network]} alt="" className={classes.networkLogo}/>*/}

                                <CestaNetworkMessage variant="body1">
                                    Switch To {CapitalizeFirstLetter(network)} Mainnet
                                </CestaNetworkMessage>
                            </SelectNetworkButton>
                        })}
                    </Grid>
                </Grid>
            </DialogContent>}
        </DialogMain>
    </Fragment>

}

export default NetworkSelection;