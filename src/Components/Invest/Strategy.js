import { Fragment, useEffect, useState } from "react";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Box,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";

import StrategyDetails from "./StrategyDetails";
import { getWalletAmount } from "../../store/interactions/stableCoins";
import {
  getDepositAmountFromContract,
  getPricePerFullShare,
} from "../../store/interactions/vaults";
import { accountSelector } from "../../store/selectors/web3";
import ArrowDown from "../../assets/commons/arrow-down.png";
import useGAEventsTracker from "../../Analytics/useGAEventsTracker";

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  "&.MuiPaper-root": {
    background: "transparent",
    borderRadius: "26px",
    border: 0,
    boxShadow: "none",
  },
}));

const useStyles = makeStyles((theme) => ({
  assetImages: {
    height: "30px",
    marginLeft: "25px",
    top: "24%",
    position: "absolute",
    ["@media (max-width:1200px)"]: {
      // eslint-disable-line no-useless-computed-key
      width: "60px",
      marginLeft: "10px",
    },
    ["@media (max-width:1000px)"]: {
      // eslint-disable-line no-useless-computed-key
      width: "55px",
      marginLeft: "10px",
    },
    ["@media (max-width:800px)"]: {
      // eslint-disable-line no-useless-computed-key
      width: "50px",
      marginLeft: "0px",
    },
  },
  downArrow: {
    height: "8px",
    marginBottom: "4px",
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  "&.MuiAccordionSummary-root": {
    background: "rgba(39, 62, 112, 0.25)",
    borderRadius: "1.5rem",
    border: 0,
    margin: "10px 0 10px 0",
  },
}));

const TokenName = styled(Typography)((theme) => ({
  "&.MuiTypography-root": {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "1.1rem",
    lineHeight: "1.1rem",
    alignItems: "center",
    position: "absolute",
    top: "36%",
    left: "12%",
    color: "#FFFFFF",
    ["@media (max-width:1500px)"]: {
      // eslint-disable-line no-useless-computed-key
      left: "15%",
    },
    ["@media (max-width:1200px)"]: {
      // eslint-disable-line no-useless-computed-key
      fontSize: "1.0rem",
    },
    ["@media (max-width:890px)"]: {
      // eslint-disable-line no-useless-computed-key
      fontSize: "0.8rem",
    },
  },
}));

const ValueLabel = styled(Typography)((theme) => ({
  "&.MuiTypography-root": {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "1.1rem",
    lineHeight: "1.1rem",
    alignItems: "right",
    position: "absolute",
    top: "36%",
    marginLeft: "5px",
    color: "#FFFFFF",
  },
}));

const LiquidityLabel = styled(Typography)((theme) => ({
  "&.MuiTypography-root": {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "1.1rem",
    lineHeight: "1.1rem",
    alignItems: "center",
    position: "absolute",
    marginLeft: "-2px",
    top: "36%",
    // left: "63%",
    color: "#FFFFFF",
  },
}));

const RoiLabel = styled(Typography)((theme) => ({
  "&.MuiTypography-root": {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "1.1rem",
    lineHeight: "1.1rem",
    alignItems: "right",
    position: "absolute",
    top: "36%",
    // right: "13%",
    color: "#15C73E",
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(() => ({
  "&.MuiAccordionDetails-root": {
    padding: "8px 0 8px 0",
  },
}));

function Strategy({ strategyData, strategyContract, vaultContract }) {
  const classes = useStyles();

  const [isExpanded, SetIsExpanded] = useState(false);
  const [strategyImage, SetStrategyImage] = useState(null);
  const [depositedShares, SetDepositedShares] = useState(0);
  const [depositedAmount, SetDepositedAmount] = useState(0);
  const GAEventsTracker = useGAEventsTracker("Strategy Dropdown");

  const account = useSelector(accountSelector);

  const getStrategyLogo = async () => {
    try {
      const imageData = await import(
        `../../assets/vaults/${strategyData.symbol}.${strategyData.logoFormat}`
      );
      SetStrategyImage(imageData.default);
    } catch (Err) {
      console.log(Err);
    }
  };

  const getShareAndUSDValue = async () => {
    try {
      let strategyBalance = await getWalletAmount(
        vaultContract.contract,
        account
      );
      strategyBalance = parseFloat(
        (strategyBalance / 10 ** strategyData.decimals).toFixed(8)
      );
      SetDepositedShares(strategyBalance);

      let vaultPricePerFullShare = await getPricePerFullShare(
        vaultContract.contract
      );

      let depositPendingAmount = await getDepositAmountFromContract(
        vaultContract.contract,
        account
      );
      let strategyBalanceInUSD = strategyBalance * vaultPricePerFullShare;
      SetDepositedAmount(parseFloat(strategyBalanceInUSD.toFixed(4)));
    } catch (Err) {}
  };

  useEffect(() => {
    getStrategyLogo();
    getShareAndUSDValue();
  }, []);

  return (
    <Fragment>
      <StyledAccordion
        expanded={isExpanded}
        onChange={() => {
          SetIsExpanded(!isExpanded);
          isExpanded
            ? GAEventsTracker(strategyData.name, "Expanded")
            : GAEventsTracker(strategyData.name, "Closed");
        }}
      >
        <StyledAccordionSummary
          expandIcon={
            <Box
              sx={{
                background: "rgba(39, 62, 112, 0.25)",
                borderRadius: "50%",
                height: "24px",
                width: "24px",
                padding: "4px",
              }}
            >
              <img src={ArrowDown} alt="" className={classes.downArrow} />
              {/*<ExpandMoreIcon />*/}
            </Box>
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Grid container>
            <Grid item xs={6}>
              <img src={strategyImage} className={classes.assetImages} alt="" />
              {/*<img src={Asset2} className={classes.assetImages} alt=""/>*/}
              {/*<img src={Asset3} className={classes.assetImages} alt=""/>*/}
              <TokenName variant="body">{strategyData.name}</TokenName>
            </Grid>
            <Grid item xs={2} sx={{ textAlign: "center", marginLeft: "-15px" }}>
              <ValueLabel component={"span"}>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 3,
                  minimumFractionDigits: 2,
                }).format(Number(depositedAmount).toFixed(2))}
              </ValueLabel>
            </Grid>
            <Grid item xs={2} sx={{ textAlign: "center" }}>
              <LiquidityLabel component={"span"}>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 3,
                  minimumFractionDigits: 2,
                }).format(Number(strategyData.liquidity).toFixed(2))}
              </LiquidityLabel>
            </Grid>
            <Grid item xs={2} sx={{ textAlign: "center", marginLeft: "10px" }}>
              <RoiLabel component={"span"}>{strategyData.ROI} %</RoiLabel>
              {/*<Box sx={{right: '10%', top: '30%', position: 'absolute'}}>*/}
              {/*  <Tooltip*/}
              {/*      title={"ROI"}*/}
              {/*      placement="top-end"*/}
              {/*  >*/}
              {/*    <InfoIcon sx={{color: 'rgba(55, 88, 148, 1)'}}/>*/}
              {/*  </Tooltip>*/}
              {/*</Box>*/}
            </Grid>
          </Grid>
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          <StrategyDetails
            getShareAndUSDValue={getShareAndUSDValue}
            depositedAmount={depositedAmount}
            isExpanded={isExpanded}
            strategyData={strategyData}
            strategyContract={strategyContract}
            depositedShares={depositedShares}
            vaultContract={vaultContract}
          />
        </StyledAccordionDetails>
      </StyledAccordion>
    </Fragment>
  );
}

export default Strategy;
