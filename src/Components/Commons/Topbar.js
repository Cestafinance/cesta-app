import React, { Fragment, useState, useEffect, useContext } from "react";

import { makeStyles, styled } from "@mui/styles";
import { Typography } from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { networkMap, networkScanUrl } from "../../Constants/mains";
import NetworkSelection from "./NetworkSelection";
import {
  changeWalletAction,
  disconnectWallet as disconnectWalletAction,
} from "../../store/actions/web3";
import AvalancheImage from "../../assets/networks/avalanche.png";

import {
  networkIdSelector,
  accountSelector,
  sourceSelector,
} from "../../store/selectors/web3";

import { CapitalizeFirstLetter } from "../../Util/textUtil";

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
    // width: "14rem",
    padding: "8px",
    background: "rgba(57, 198, 228, 0.08)",
    borderRadius: "23px",
    // cursor: "pointer",
    marginRight: "10px",
    color: "#FFFFFF",
  },
  networkLogo: {
    height: "1.25rem",
    // position: "absolute",
    marginLeft: "0.25rem",
  },
  networkName: {
    fontFamily: "Inter",
    color: "white",
    fontSize: "3rem",
    fontWeight: "bold",
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
    border: `1px solid rgba(55, 88, 148, 0.5)`,
    background: "#141316",
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
    background: "#141316",
    border: `1px solid rgba(55, 88, 148, 0.5)`,
    borderRadius: "23px",
    padding: "10px 0px",
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
    width: "100%",
    "&.MuiTypography-root": {
      margin: "3px 0px",
    },
    "&:hover": {
      background: "#375894",
    },
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
    marginLeft: "8px",
    color: "#FFFFFF",
  },
}));

const AccountAddress = styled(Typography)((theme) => ({
  "&.MuiTypography-root": {
    width: "70%",
  },
}));

const NetworkSelectButton = styled("div")(({ theme }) => ({
  // cursor: "pointer",
  display: "flex",
  border: `1px solid rgba(55, 88, 148, 0.5)`,
  color: theme.palette.text.main,
  padding: "8px",
  alignItems: "center",
  fontSize: "12px",
  background: "#141316",
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

  useEffect(() => {
    // if(networkId === 1) {
    //   window.location.reload(false);
    // }
    SetNetworkSelectOpen(
      networkId !== 0 && networkMap[networkId] === undefined
    );
  }, [networkId]);

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
  console.log(isNetworkSelectOpen, networkId, account);
  return (
    <Fragment>
      <div className={classes.headerContainer}>
        <div className={classes.header}>
          <div className={classes.grow}>
            <NetworkSelection
              open={
                isNetworkSelectOpen ||
                Boolean(!networkMap[networkId] && account && networkId !== 0)
              }
              // open={isNetworkSelectOpen}
              handleClose={handleNetworkSelectionOption}
              networkImages={networkImages}
              title={!networkMap[networkId]}
            />
            {openOptions && (
              <div className={classes.menuDropDown}>
                <Typography
                  variant="body1"
                  className={classes.optionsList}
                  sx={{ marginTop: "15px" }}
                  noWrap
                  onClick={() => {
                    SetOpenOptions(!openOptions);
                    changeWallet();
                  }}
                >
                  Change wallet
                </Typography>
                <Typography
                  variant="body1"
                  className={classes.optionsList}
                  noWrap
                  onClick={() => {
                    SetOpenOptions(!openOptions);
                    disconnectWallet();
                  }}
                >
                  Disconnect
                </Typography>
                <Typography
                  variant="body1"
                  className={classes.optionsList}
                  sx={{ marginBottom: "15px" }}
                  noWrap
                  onClick={() => {
                    SetOpenOptions(!openOptions);
                    openEtherScanLink();
                  }}
                >
                  View On Explorer
                </Typography>
              </div>
            )}
          </div>
          {account && networkMap[networkId] && (
            <NetworkSelectButton
              className={classes.networkDropDown}
              // onClick={handleNetworkSelectionOption}
            >
              <div style={{display: "flex", flexDirection:"row", alignItems: "center"}}>
                <img
                  src={AvalancheImage}
                  alt=""
                  className={classes.networkLogo}
                />
                <Typography sx={{marginLeft:"8px", marginRight: "4px"}}>{CapitalizeFirstLetter(networkMap[networkId])} {networkMap[networkId] && <span>Network</span>}</Typography>
                {/* <SelectedNetwork className={classes.networkName}>
                  &nbsp; &nbsp;{CapitalizeFirstLetter(networkMap[networkId])}
                  &nbsp;{networkMap[networkId] && <span>Network</span>}
                </SelectedNetwork> */}
              </div>
            
              {/* <ArrowDropDown className={classes.dropDownIcon} /> */}
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
