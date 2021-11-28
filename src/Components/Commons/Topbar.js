import React, { Fragment, useState, useEffect, useContext } from "react";
import { useLocation } from 'react-router-dom';

import { makeStyles, styled } from "@mui/styles";
import { Typography, Switch } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";


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
    const [pageName, setPageName] = useState("Invest");

    const classes = useStyles();
    const network = useSelector(networkIdSelector);
    const account = useSelector(accountSelector);
    const source = useSelector(sourceSelector);

    return <Fragment>
        <div className={classes.headerContainer}>
            <div className={classes.header}>
                <div className={classes.currentMenu}>
                    <span variant={"h2"}>{account} +</span>
                    <div style={{ marginLeft: "24px" }}>
                    </div>
                </div>
                <div>
                    {/* <ThemeSwitch/> */}
                </div>
            </div>
        </div>
    </Fragment>
}

export default Topbar;
