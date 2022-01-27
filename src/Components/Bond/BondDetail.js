import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  TableRow,
  Typography,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import ArrowDown from "../../assets/commons/arrow-down.png";
import bond from "src/helpers/bond";
import Price from "./Price";
import Action from "./Action";
import { LoadingPulse } from "../Commons/SharedComponent";
import { trim } from "src/helpers";
import {
  calcBondDetails,
  calcBondExtraDetails,
} from "src/store/slices/bond-slice";
import { useDispatch, useSelector } from "react-redux";
import {
  accountSelector,
  networkIdSelector,
  providerSelector,
} from "src/store/selectors/web3";
import { calculateUserBondDetails } from "src/store/slices/account-slice";
import { render } from "@testing-library/react";

const useStyles = makeStyles((theme) => ({
  assetImages: {
    height: "30px",
  },
  downArrow: {
    height: "8px",
    marginBottom: "4px",
  },
  textAlignStart: {
    "&.MuiTypography-root": {
      textAlign: "start",
    },
  },
  priceContainer: {
    width: "40%",
    marginRight: "16px",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      marginRight: "0px",
    },
  },
  actionContainer: {
    width: "60%",
    [theme.breakpoints.down("md")]: {
      marginTop: "16px",
      width: "100%",
    },
  },
  containerLayout: {
    border: "1px solid  rgba(255, 255, 255, 0.2)",
    borderRadius: "26px",
  },
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  "&.MuiPaper-root": {
    background: "transparent",
    borderRadius: "26px",
    border: 0,
    boxShadow: "none",
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

const DetailLabel = styled(Typography)(({ theme }) => ({
  "&.MuiTypography-root": {
    fontFamily: "Inter",
    color: "#ffffff",
    ["@media (max-width:1200px)"]: {
      // eslint-disable-line no-useless-computed-key
      fontSize: "1.0rem",
    },
    ["@media (max-width:890px)"]: {
      // eslint-disable-line no-useless-computed-key
      fontSize: "0.75rem",
      display: "inline-block",
    },
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  "&.MuiAccordionDetails-root": {
    padding: "8px 0 8px 0",
  },
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

function BondDetail({ bondData, loadingDetail }) {
  const classes = useStyles();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [firstTimeLoad, setFirstTimeLoad] = useState(true);

  const [discount, setDiscount] = useState(0);
  const [bondPrice, setBondPrice] = useState(null);
  const [purchased, setPurchased] = useState(null);

  const dispatch = useDispatch();

  const provider = useSelector(providerSelector);
  const networkID = useSelector(networkIdSelector);
  const account = useSelector(accountSelector);

  useEffect(() => {
    if (!loadingDetail) {
      setFirstTimeLoad(false);
    }
  }, [loadingDetail]);

  useEffect(() => {
    if (isExpanded) {
      // Refresh bond detail, and adding extra detail
      dispatch(
        calcBondDetails({ bond: bondData, value: null, provider, networkID })
      );
      dispatch(
        calcBondExtraDetails({
          bond: bondData,
          value: null,
          provider,
          networkID,
        })
      );

      // Getting user bond detail
      dispatch(
        calculateUserBondDetails({
          address: account,
          bond: bondData,
          provider,
          networkID,
        })
      );
    }
  }, [isExpanded]);

  // Set discount
  useEffect(() => {
    const discountLabel = `${
      bondData.bondDiscount === undefined
        ? "0.00"
        : trim(bondData.bondDiscount * 100, 2)
    } %`;
    setDiscount(discountLabel);
  }, [bondData.bondDiscount]);

  // Set bond price
  useEffect(() => {
    const bondPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 3,
      minimumFractionDigits: 2,
    }).format(
      isNaN(Number(bondData.bondPrice).toFixed(2))
        ? 0
        : Number(bondData.bondPrice).toFixed(2)
    );

    setBondPrice(bondPrice);
  }, [bondData.bondPrice]);

  // Set purchased
  useEffect(() => {
    const bondPurchased = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 3,
      minimumFractionDigits: 2,
    }).format(
      isNaN(Number(bondData.purchased).toFixed(2))
        ? 0
        : Number(bondData.purchased).toFixed(2)
    );

    setPurchased(bondPurchased);
  }, [bondData.purchased]);

  // Getting user bond detail
  useEffect(() => {
    if (selectedTab === 1) {
      dispatch(
        calculateUserBondDetails({
          address: account,
          bond: bondData,
          provider,
          networkID,
        })
      );
    }
  }, [selectedTab]);

  const handleTabSelected = (event) => {
    setSelectedTab(event);
  };

  const renderLabel = (value) => {
    return firstTimeLoad ? (
      <LoadingPulse skeletonWidth={100} />
    ) : (
      <DetailLabel component={"span"}>{value}</DetailLabel>
    );
  };

  return (
    <TableRow>
      <StyledAccordion
        expanded={isExpanded}
        onChange={() => {
          setIsExpanded(!isExpanded);
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
            </Box>
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Grid container sx={{ padding: "0 20px 0 20px", textAlign: "start" }}>
            {/** Info */}
            <Grid item xs={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <img
                  src={"https://via.placeholder.com/30"}
                  className={classes.assetImages}
                  alt={bond.name}
                />
                <DetailLabel
                  variant="body"
                  sx={{ marginLeft: "8px", fontWeight: "bold" }}
                >
                  {bondData.displayName}
                </DetailLabel>
              </Box>
            </Grid>

            {/** Price */}
            <Grid item xs={2} className={classes.textAlignStart}>
              {renderLabel(bondPrice)}
            </Grid>

            {/** ROI */}
            <Grid item xs={2} className={classes.textAlignStart}>
              {renderLabel(discount)}
            </Grid>

            {/** Purchased */}
            <Grid item xs={2} className={classes.textAlignStart}>
              {renderLabel(purchased)}
            </Grid>
          </Grid>
        </StyledAccordionSummary>

        <StyledAccordionDetails>
          <div
            className={`${classes.containerLayout} ${classes.priceContainer}`}
          >
            <Price
              tab={selectedTab}
              expanded={isExpanded}
              bondData={bondData}
            />
          </div>
          <div
            className={`${classes.actionContainer} ${classes.containerLayout}`}
          >
            <Action
              bondData={bondData}
              onTabSelected={handleTabSelected}
              expanded={isExpanded}
            />
          </div>
        </StyledAccordionDetails>
      </StyledAccordion>
    </TableRow>
  );
}

export default BondDetail;
