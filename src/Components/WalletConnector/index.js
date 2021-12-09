import React, {Fragment} from 'react';
import {Web3ReactProvider, useWeb3React} from '@web3-react/core';
import {Web3Provider} from '@ethersproject/providers';
import Web3 from 'web3';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Grid,
    CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Close as CloseIcon
} from '@mui/icons-material';
import {useDispatch, useSelector} from 'react-redux';
import {withStyles, makeStyles} from '@mui/styles';
import {useEagerConnect, useInactiveListener} from './hooks';
import {
    injected,
    walletconnect,
    walletlink,
    ledger,
    trezor,
} from './connectors';
import {
    loadWeb3,
    loadAccount
} from '../../store/interactions/web3';

import {
    changeWalletSelector,
    disconnectSelector,
    sourceSelector
} from '../../store/selectors/web3';

import {
    resetWeb3,
    disconnectWallet as disconnectWalletAction
} from '../../store/actions/web3';

import {
    setConnectionStatus
} from '../../store/local';


const ConnectorNames = {
    Injected: 'Injected',
    Network: 'Network',
    WalletConnect: 'WalletConnect',
    WalletLink: 'WalletLink',
    Ledger: 'Ledger',
    Trezor: 'Trezor',
    Lattice: 'Lattice',
    Frame: 'Frame',
    Authereum: 'Authereum',
    Fortmatic: 'Fortmatic',
    Magic: 'Magic',
    Portis: 'Portis',
    Torus: 'Torus'
}

const walletDetails = [
    {
        name: 'Metamask',
        path: 'metaMask',
        connectorName: [ConnectorNames.Injected]
    },
    {
        name: 'Wallet Connect',
        path: 'walletConnect',
        connectorName: [ConnectorNames.WalletConnect]

    },
    {
        name: 'Ledger',
        path: 'ledger',
        connectorName: [ConnectorNames.Ledger]
    },
    {
        name: 'Trezor',
        path: 'trezor',
        connectorName: [ConnectorNames.Trezor]

    },
    {
        name: 'Coinbase Wallet',
        path: 'coinbaseWallet',
        connectorName: [ConnectorNames.WalletLink]

    }
];

const connectorsByName = {
    [ConnectorNames.Injected]: injected,
    [ConnectorNames.WalletConnect]: walletconnect,
    [ConnectorNames.WalletLink]: walletlink,
    [ConnectorNames.Ledger]: ledger,
    [ConnectorNames.Trezor]: trezor,
}

const useStyles = makeStyles((theme) => ({

    walletLabel: {
        fontFamily: "Ambit",
        fontStyle: "normal",
        fontWeight: "normal",
        display: "flex",
        alignItems: "center",
        color: "#FFFFFF",

    },
    welcomeLabel: {
        fontFamily: "Ambit",
        fontStyle: "normal",
        fontWeight: "normal",
        display: "flex",
        alignItems: "center",
        color: "#39C6E4",
        fontSize: "36px",
        lineHeight: "41px"
    },
    connectWalletMessage: {
        fontFamily: "Ambit",
        fontStyle: "normal",
        fontWeight: "normal",
        display: "flex",
        alignItems: "center",
        color: "#FFFFFF",
        fontSize: "24px",
        lineHeight: "28px"
    },
    securityMessage: {
        fontFamily: "Ambit",
        fontStyle: "normal",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        color: "#39C6E4",
        padding: "20px"
    },
    securityMessageInfo: {
        fontFamily: "Ambit",
        fontStyle: "normal",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        color: "#FFFFFF",
        fontSize: "18px",
        lineHeight: "20px"
    },
    connectWalletButtonLabel: {
        fontFamily: "Ambit",
        fontWeight: "900",
        textAlign: "center",
        color: "#FFFFFF",
        fontSize: "16px",
        lineHeight: "16px"
    },
    connected: {
        background: "#0D99B8 !important"
    }

}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiDialog-paper': {
        background: theme.palette.app.light,
        width: "100%"
    }
}));

const ButtonStyle = withStyles((theme) => ({
    root: {
        background: "rgba(13, 153, 184, 0.2)",
        borderRadius: "13px",
        width: "100%",
        height: "52px",
        justifyContent: "start",
        '&:hover': {
            background: "rgba(0, 209, 255,0.5)"
        }
    }
}))(Button);

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
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
        </DialogTitle>
    );
};


function getLibrary(provider) {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
    return library
}

export default function ({loadContracts}) {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <App loadContracts={loadContracts}/>
        </Web3ReactProvider>
    )
}


function Balance({
                     loadContracts
                 }) {
    const {account, library, chainId, connector, deactivate} = useWeb3React()
    const dispatch = useDispatch();
    const disconnectNow = useSelector(disconnectSelector);

    const [balance, setBalance] = React.useState()

    const initFunction = async (provider) => {

        let connectorName = null;

        walletDetails.some((wallet) => {
            const currentConnector = connectorsByName[wallet.connectorName]
            const connected = currentConnector === connector;
            if (connected) {
                connectorName = wallet.path;
                return true;
            }
        });


        setConnectionStatus({
            source: connectorName,
            connected: true
        });


        let web3 = await loadWeb3(dispatch, provider);
        await loadAccount(dispatch, account, chainId, connectorName);
        loadContracts(web3, chainId);
    }

    React.useEffect(() => {
        if (!!account && !!library) {
            let stale = false
            let web3 = new Web3(library.provider);
            initFunction(library.provider);
            library
                .getBalance(account)
                .then((balance) => {
                    if (!stale) {
                        setBalance(balance)
                    }
                })
                .catch(() => {
                    if (!stale) {
                        setBalance(null)
                    }
                })

            return () => {
                stale = true
                setBalance(undefined)
            }
        } else {

        }
    }, [account, library, chainId]) // ensures refresh if referential identity of library doesn't change across chainIds

    React.useEffect(() => {
        if(disconnectNow) {
            deactivate();
            setConnectionStatus({});
            dispatch(resetWeb3());
        }
    }, [disconnectNow])

    return (
        <>

        </>
    )
}

function Header({
                    loadContracts
                }) {

    return (
        <>
            <Balance loadContracts={loadContracts}/>
        </>
    )
}

function App({
                 loadContracts
             }) {
    const context = useWeb3React();
    const classes = useStyles();
    const dispatch = useDispatch();
    const {connector, activate, error} = context

    // handle logic to recognize the connector currently being activated
    const [activatingConnector, setActivatingConnector] = React.useState();
    const [open, SetOpen] = React.useState(false);
    const [walletImages, setWalletImages] = React.useState({});
    const walletChangeTime = useSelector(changeWalletSelector);
    const source = useSelector(sourceSelector);

    React.useEffect(() => {
        if (walletChangeTime) {
            SetOpen(true);
        }
    }, [walletChangeTime])

    React.useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined)
        }
    }, [activatingConnector, connector])


    React.useEffect(async () => {
        let walletNameImages = {};
        for (let i = 0; i < walletDetails.length; i++) {
            let imageData = await import(`../../assets/commons/${walletDetails[i].path}.png`);

            walletNameImages[walletDetails[i].name] = imageData.default;
        }
        setWalletImages({...walletNameImages});
    }, [])

    // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
    const triedEager = useEagerConnect();

    useInactiveListener(!triedEager || !!activatingConnector)

    const handleClose = () => {
        SetOpen(false);
    }

    const disconnectConnectedWallet = () => {
        dispatch(disconnectWalletAction());
    }

    return (
        <>
            <Header loadContracts={loadContracts}/>
            <Fragment>
                <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open || !source}
                >
                    <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                        Wallet Connect
                    </BootstrapDialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Grid item xs={1}>
                            </Grid>
                            <Grid item xs={10}>
                                <Grid
                                    container
                                    direction="row"
                                    spacing={3}
                                >
                                    {walletDetails.map((wallet, index) => {
                                        const currentConnector = connectorsByName[wallet.connectorName]
                                        const activating = currentConnector === activatingConnector
                                        const connected = currentConnector === connector
                                        const disabled = !triedEager || !!activatingConnector || connected || !!error
                                        return <Grid item key={index}
                                                     xs={12} sm={6}

                                        >

                                            {connected && <ButtonStyle
                                                key={wallet.name}
                                                onClick={disconnectConnectedWallet}
                                                className={classes.connected}
                                            >
                                                {activating ? <CircularProgress size={20} /> : <Fragment>
                                                    <img style={{height: "20px", marginRight: "10px"}}
                                                         src={walletImages[wallet.name] ? walletImages[wallet.name] : ''}
                                                         alt=""/>
                                                    <Typography variant="body1" className={classes.walletLabel}>
                                                        Deactivate
                                                    </Typography>
                                                </Fragment>}
                                            </ButtonStyle>}
                                            {!connected && <ButtonStyle
                                                key={wallet.name}
                                                onClick={() => {
                                                    setActivatingConnector(currentConnector)
                                                    activate(connectorsByName[wallet.connectorName])
                                                }}
                                                className={connected ? classes.connected : ''}
                                            >
                                                {activating ? <CircularProgress size={20} /> : <Fragment>
                                                    <img style={{height: "20px", marginRight: "10px"}}
                                                         src={walletImages[wallet.name] ? walletImages[wallet.name] : ''}
                                                         alt=""/>
                                                    <Typography variant="body1" className={classes.walletLabel}>
                                                        {wallet.name}
                                                    </Typography>
                                                </Fragment>}
                                            </ButtonStyle>}
                                        </Grid>
                                    })}


                                </Grid>
                            </Grid>
                            <Grid item xs={1}>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </BootstrapDialog>
            </Fragment>
        </>
    )
}
