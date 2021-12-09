import React, { Fragment, useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";

import { makeStyles, styled } from "@mui/styles";
import { Typography } from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import online from "../../assets/commons/online.png";
import { networkMap, networkScanUrl } from "../../Constants/mains";
import NetworkSelection from "./NetworkSelection";
import {
  changeWalletAction,
  disconnectWallet as disconnectWalletAction,
} from "../../store/actions/web3";

import {
  networkIdSelector,
  accountSelector,
  sourceSelector,
} from "../../store/selectors/web3";

// import { CustomThemeContext } from "../../themes/CustomThemeProvider";

// import { networkIdLoaded } from "../../store/actions";

const useStyles = makeStyles((theme) => ({
  headerContainer: {
    verticalAlign: "top",
    width: "calc(100% - 240px)",
    height: "80px",
    display: "flex",
    padding: "20px 80px 0px 80px",
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
  header: {
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
    alignItems: "center",
    fontSize: "26px",
    color: theme.palette.text.main,
    [theme.breakpoints.down("md")]: {
      marginLeft: "50px",
    },
  },
  alignRight: {
    float: "right",
    color: "#FFFFFF",
  },
  grow: {
    flexGrow: 1,
    padding: "25px",
  },
  networkDropDown: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "12rem",
    padding: "8px",
    background: "rgba(57, 198, 228, 0.08)",
    borderRadius: "23px",
    cursor: "pointer",
    marginRight: "10px",
    color: "#FFFFFF",
  },
  networkLogo: {
    height: "1.75rem",
    position: "absolute",
  },
  networkName: {
    color: "white",
  },
  networkOptionsLogo: {
    height: "1.5rem",
    position: "absolute",
    marginTop: "13px",
  },
  selectedNetwork: {
    marginLeft: "16px",
  },
  dropDownIcon: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
    top: "48%",
    right: "320px",
    position: "absolute",
  },
  dropDownIconAccount: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
    top: "48%",
    right: "100px",
    position: "absolute",
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
    width: "14rem",
    padding: "8px",
    background: "rgba(57, 198, 228, 0.08)",
    borderRadius: "23px",
    cursor: "pointer",
    color: "#FFFFFF",
  },
  sourceLogo: {
    height: "20px",
    marginRight: "8px",
    marginTop: "2px",
  },
  menuDropDown: {
    position: "absolute",
    float: "right",
    right: "82px",
    top: "105%",
    background: "rgba(57, 198, 228, 0.08)",
    borderRadius: "23px",
    width: "14rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  optionsList: {
    color: "white",
    cursor: "pointer",
    height: "1.75rem",
    marginRight: "0.75rem",
  },
  userAddress: {
    width: "6rem",
    marginRight: "0.75rem",
  },
  onlineIcon: {
    height: "0.75rem",
    marginLeft: "0.75rem",
  },
}));

const SelectedNetwork = styled(Typography)((theme) => ({
  "&.MuiTypography-root": {
    marginLeft: "25px",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
}));

const AccountAddress = styled(Typography)((theme) => ({
  "&.MuiTypography-root": {
    width: "70%",
  },
}));

const NetworkSelectButton = styled("div")(({ theme }) => ({
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
  const [isNetworkSelectOpen, SetNetworkSelectOpen] = React.useState(false);

  const classes = useStyles();
  const dispatch = useDispatch();
  const networkId = useSelector(networkIdSelector);
  const account = useSelector(accountSelector);
  const source = useSelector(sourceSelector);

  useEffect(() => {
    getNetworkImages();
  }, []);

  useEffect(() => {
    getImageData(source);
  }, [source]);

  const handleNetworkSelectionOption = () => {
    SetNetworkSelectOpen(!isNetworkSelectOpen);
  };

  const getNetworkImage = async (name) => {
    try {
      let imageData = await import(`../../assets/networks/${name}.png`);
      return imageData.default;
    } catch (Err) {
      return "";
    }
  };

  const getImageData = async (path) => {
    try {
      let imageData = await import(`../../assets/commons/${path}.png`);
      setImageData(imageData && imageData.default ? imageData.default : "");
    } catch (Err) {
      return setImageData("");
    }
  };

  const getNetworkImages = async () => {
    let networks = Object.values(networkMap);
    let imageObj = {};
    for (let i = 0; i < networks.length; i++) {
      imageObj[networks[i]] = await getNetworkImage(networks[i]);
    }
    setNetworkImages({ ...imageObj });
  };

  const changeWallet = () => {
    dispatch(changeWalletAction());
  };

  const disconnectWallet = () => {
    dispatch(disconnectWalletAction());
  };

  const openEtherScanLink = () => {
    let url = networkScanUrl[networkId];
    window.open(`${url}address/${account}`, "_blank").focus();
  };

  return (
    <Fragment>
      <div className={classes.headerContainer}>
        <div className={classes.header}>
          <div className={classes.grow}>
            <NetworkSelection
              open={isNetworkSelectOpen}
              handleClose={handleNetworkSelectionOption}
              networkImages={networkImages}
              title={!networkMap[networkId]}
            />
            {openOptions && (
              <div className={classes.menuDropDown}>
                <Typography
                  variant="body1"
                  className={classes.optionsList}
                  noWrap
                  onClick={changeWallet}
                >
                  Change wallet
                </Typography>
                <Typography
                  variant="body1"
                  className={classes.optionsList}
                  noWrap
                  onClick={disconnectWallet}
                >
                  Disconnect
                </Typography>
                <Typography
                  variant="body1"
                  className={classes.optionsList}
                  noWrap
                  onClick={openEtherScanLink}
                >
                  View On Etherscan
                </Typography>
              </div>
            )}
          </div>
          {account && (
            <NetworkSelectButton
              className={classes.networkDropDown}
              onClick={handleNetworkSelectionOption}
            >
              <img
                src={networkImages[networkMap[networkId]]}
                alt=""
                className={classes.networkLogo}
              />
              <SelectedNetwork className={classes.networkName} noWrap>
                &nbsp; &nbsp;{networkMap[networkId]}&nbsp;
              </SelectedNetwork>
              <ArrowDropDown className={classes.dropDownIcon} />
            </NetworkSelectButton>
          )}
          {account && (
            <div
              className={classes.sectionDesktop}
              onClick={() => SetOpenOptions(!openOptions)}
            >
              <img src={imageData} alt="" className={classes.sourceLogo} />
              <AccountAddress
                variant="body1"
                noWrap
                onClick={() => SetOpenOptions(!openOptions)}
              >
                {account}
              </AccountAddress>
              <ArrowDropDown className={classes.dropDownIconAccount} />

              {/*<img src={online} alt="" className={classes.onlineIcon}/>*/}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default Topbar;
