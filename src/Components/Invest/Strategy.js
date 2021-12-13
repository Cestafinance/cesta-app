import { Fragment, useEffect, useState } from "react";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Box
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";

import StrategyDetails from "./StrategyDetails";
import { getWalletAmount } from "../../store/interactions/stableCoins";
import {
  getDepositAmountFromContract,
  getPricePerFullShare,
} from "../../store/interactions/vaults";
import { accountSelector } from "../../store/selectors/web3";

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
    marginLeft: "-10px",
    borderRadius: "50%",
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  "&.MuiAccordionSummary-root": {
    background: "rgba(39, 62, 112, 0.25)",
    borderRadius: "1.5rem",
    border: 0,
  },
}));

const TokenName = styled(Typography)((theme) => ({
  "&.MuiTypography-root": {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "1rem",
    lineHeight: "1rem",
    alignItems: "center",
    position: "absolute",
    top: "28%",
    left: "12%",
    color: "#FFFFFF",
  },
}));

const ValueLabel = styled(Typography)((theme) => ({
  "&.MuiTypography-root": {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "1rem",
    lineHeight: "1rem",
    alignItems: "right",
    position: "absolute",
    top: "28%",
    // left: "45%",
    color: "#FFFFFF",
  },
}));

const LiquidityLabel = styled(Typography)((theme) => ({
  "&.MuiTypography-root": {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "1rem",
    lineHeight: "1rem",
    alignItems: "center",
    position: "absolute",
    top: "28%",
    // left: "63%",
    color: "#FFFFFF",
  },
}));

const RoiLabel = styled(Typography)((theme) => ({
  "&.MuiTypography-root": {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "18px",
    lineHeight: "18px",
    alignItems: "right",
    position: "absolute",
    top: "28%",
    // right: "13%",
    color: "#15C73E",
  },
}));

function Strategy({ strategyData, strategyContract, vaultContract }) {
  const classes = useStyles();

  const [isExpanded, SetIsExpanded] = useState(false);
  const [strategyImage, SetStrategyImage] = useState(null);
  const [depositedShares, SetDepositedShares] = useState(0);
  const [depositedAmount, SetDepositedAmount] = useState(0);

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
        }}
      >
        <StyledAccordionSummary
          expandIcon={<Box sx={{

            background: 'rgba(39, 62, 112, 0.25)',
            borderRadius: '50%',
            height: '24px'
          }}>
            <ExpandMoreIcon  />
          </Box>}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Grid container>
            <Grid item xs={3}>
              <img src={strategyImage} className={classes.assetImages} alt="" />
              {/*<img src={Asset2} className={classes.assetImages} alt=""/>*/}
              {/*<img src={Asset3} className={classes.assetImages} alt=""/>*/}
              <TokenName variant="body">{strategyData.name}</TokenName>
            </Grid>
            <Grid item xs={3} sx={{textAlign: 'center', marginLeft: '-15px'}}>
              <ValueLabel component={'span'}>$ {depositedAmount.toLocaleString()}</ValueLabel>
            </Grid>
            <Grid item xs={3} sx={{textAlign: 'center'}}>
              <LiquidityLabel component={'span'}>$ {strategyData.liquidity}</LiquidityLabel>
            </Grid>
            <Grid item xs={3}  sx={{textAlign: 'center', marginLeft: '10px'}}>
              <RoiLabel component={'span'}>{strategyData.ROI} %</RoiLabel>
            </Grid>
          </Grid>
        </StyledAccordionSummary>
        <AccordionDetails>
          <StrategyDetails
            getShareAndUSDValue={getShareAndUSDValue}
            depositedAmount={depositedAmount}
            isExpanded={isExpanded}
            strategyData={strategyData}
            strategyContract={strategyContract}
            depositedShares={depositedShares}
            vaultContract={vaultContract}
          />
        </AccordionDetails>
      </StyledAccordion>
    </Fragment>
  );
}

export default Strategy;
