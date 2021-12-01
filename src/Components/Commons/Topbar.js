import React, { Fragment, useState, useEffect, useContext } from "react";
import { useLocation } from 'react-router-dom';

import { makeStyles, styled } from '@mui/styles';
import { Typography, Switch } from '@mui/material';
import {ArrowDropDown} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

import {
    networkMap
} from '../../Constants/mains';


import { networkIdSelector, accountSelector, sourceSelector } from "../../store/selectors/web3";

// import { CustomThemeContext } from "../../themes/CustomThemeProvider";

// import { networkIdLoaded } from "../../store/actions";


const useStyles = makeStyles(theme => ({
    headerContainer: {
        verticalAlign: "top",
        width: "calc(100% - 240px)",
        height: "60px",
        display: "flex",
        padding: "40px 80px 0px 80px",
        background: theme.palette.app.main,
        position: "fixed",
        left: "240px",
        zIndex: "10",
        [theme.breakpoints.down("md")]: {
            width: "100%",
            marginBottom: "20px",
            left: "0px",
            padding: "0px",
        },
    },
    header:  {
        borderBottom: `1px solid ${theme.palette.border.light}`,
        borderTop: "none",
        width: "100%",
        display: "flex",
        padding: "15px 0px",
        alignItems: "center",
        justifyContent: "space-between",
        [theme.breakpoints.down("md")]: {
            padding: "15px",
        },
    },
    currentMenu: {
        display: "flex",
        alignItems:"center",
        fontSize: "26px",
        color: theme.palette.text.main,
        [theme.breakpoints.down("md")]: {
            marginLeft: "50px",
        },
    },
    alignRight: {
        float: 'right',
        color: '#FFFFFF'
    },
    grow: {
        flexGrow: 1,
        padding: "25px"
    },
    networkDropDown: {
        width: "40px",
        padding: "8px",
        background: "rgba(57, 198, 228, 0.08)",
        borderRadius: "23px",
        cursor: "pointer",
        marginRight: "10px"
    },
    networkLogo: {
        height: "14px",
        position: "absolute",
        marginTop: "6px"
    },
    networkOptionsLogo: {
        height: "14px",
        position: "absolute",
        marginTop: "13px"
    },
    selectedNetwork: {
        marginLeft: "16px"
    },
    dropDownIcon: {
        top: "32%",
        right: "13%",
        position: "absolute",
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
        width: "10%",
        padding: "8px",
        background: "rgba(57, 198, 228, 0.08)",
        borderRadius: "23px",
        cursor: "pointer",
        color: '#FFFFFF'
    },
    sourceLogo: {
        height: "20px",
        marginRight: "8px"
    },
}));

const NetworkSelectButton = styled('div')(({ theme }) => ({
    cursor: "pointer",
    display: "flex",
    border: `1px solid ${theme.palette.border.main}`,
    color: theme.palette.text.main,
    padding: "8px",
    alignItems: "center",
    fontSize: "12px",
}));



function Topbar() {

    const [openOptions, SetOpenOptions] = React.useState(false);
    const [imageData, setImageData] = React.useState(null);
    const [networkImages, setNetworkImages] = React.useState({});

    const classes = useStyles();
    const networkId = useSelector(networkIdSelector);
    const account = useSelector(accountSelector);
    const source = useSelector(sourceSelector);

    useEffect(() => {
        getNetworkImages();
        getImageData(source);
    }, []);

    const handleNetworkSelectionOption = () => {

    }

    const getNetworkImage = async (name) => {
        try {
            let imageData = await import(`../../assets/networks/${name}.png`);
            return imageData.default;
        } catch (Err) {
            return '';
        }
    }

    const getImageData = async (path) => {

        try {
            let imageData = await import(`../../assets/commons/${path}.png`);
            setImageData(imageData && imageData.default ? imageData.default : '');
        } catch (Err) {
            return setImageData('');
        }
    }

    const getNetworkImages = async () => {
        let networks = Object.values(networkMap);
        let imageObj ={};
        for(let i=0 ;i< networks.length; i++) {
            imageObj[networks[i]] = await getNetworkImage(networks[i]);
        }
        setNetworkImages({...imageObj});
    }

    return <Fragment>
        <div className={classes.headerContainer}>
            <div className={classes.header}>
                <div className={classes.grow}>

                </div>
                {account && <div className={classes.networkDropDown} onClick={handleNetworkSelectionOption}>
                    <img src={networkImages[networkMap[networkId]]} alt="" className={classes.networkLogo}/>
                    <Typography variant="body1" className={classes.selectedNetwork} noWrap>
                        &nbsp;
                    </Typography>
                    <ArrowDropDown className={classes.dropDownIcon}/>
                </div>}
                {account && <div className={classes.sectionDesktop} onClick={() => SetOpenOptions(!openOptions)}>
                    <img src={imageData} alt="" className={classes.sourceLogo}/>
                    <Typography variant="body1" noWrap>
                        {account}
                    </Typography>
                </div>}
            </div>
        </div>
    </Fragment>
}

export default Topbar;
