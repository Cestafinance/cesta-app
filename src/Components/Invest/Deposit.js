import { Fragment, useState } from "react";

import { Grid, Box, TextField, Button, Typography } from "@mui/material";
import { styled, makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import { scales } from "../../Constants/utils";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ActionConfirm from "./modals/Modal";
import DepositTemplate from "./modals/Deposit";
import { stableCoinsSelector } from "../../store/selectors/commons";
import { accountSelector } from "../../store/selectors/web3";

const useStyles = makeStyles(({ theme }) => ({
  assetScaleLabel: {
    margin: "0.3rem",
    cursor: "pointer",
  },
  assetMaxlabel: {
    marginLeft: "0.3rem",
    cursor: "pointer",
  },
  logoStableCoins: {
    height: "20px",
    marginTop: "2px",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "&.MuiTextField-root": {
    width: "100%",
    background: "#1B203C",
    borderRadius: "20px",
    boxSizing: "border-box",
  },
  "& .MuiInputBase-root": {
    background: "#1B203C",
    boxSizing: "border-box",
    borderRadius: "20px",
    width: "100%",
    color: "#FFFFFF",
  },
  "&.Mui-error": {
    borderRadius: "20px",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  "&.MuiButton-root": {
    background: theme.palette.primary.main,
    width: "100%",
    boxShadow: "none",
    borderRadius: "16px",
    zIndex: 4,
    color: "#FFFFFF",
    padding: "12px 0px",
    textTransform: "uppercase",
    fontSize: "16px",
    "&:hover": {
      background: "rgba(39, 62, 112, 0.5)",
    },
  },
  "&.Mui-disabled": {
    backgroundColor: "none",
  },
}));

function Deposit({
  strategyData,
  getStableCoinWalletDetails,
  vaultContract,
  coinBalances,
  stableCoinLogos,
  getShareAndUSDValue,
}) {
  const classes = useStyles();

  const [openCoinSelection, SetOpenCoinSelecting] = useState(false);
  const [inputError, SetInputError] = useState(false);
  const [selectedCoinIndex, SetSelectedCoinIndex] = useState(0);
  const [depositAmount, SetDepositAmount] = useState(0);
  const [open, SetOpen] = useState(false);
  const stableCoinsContracts = useSelector(stableCoinsSelector);
  const account = useSelector(accountSelector);

  const selectPercentage = (value) => {
    let balance = parseFloat(
      coinBalances[strategyData.tokens[selectedCoinIndex]]
    );

    let amount = (balance * (value / 100)).toFixed(4);
    SetDepositAmount(amount);
    SetInputError(false);
  };

  const confirmDeposit = () => {
    SetOpen(true);
  };

  const handleClose = () => {
    SetOpen(false);
  };

  const onInputChange = (value) => {
    let decimals = value.match(/\./g);
    if (decimals && decimals.length > 1) {
      return value;
    }
    let balance = parseFloat(
      coinBalances[strategyData.tokens[selectedCoinIndex]]
    );
    if (
      (decimals && decimals.length === 1 && value[value.length - 1] === ".") ||
      value[value.length - 1] === "0"
    ) {
      SetInputError(balance < value);
      SetDepositAmount(value);
      return;
    }
    let newVal = parseFloat(value);
    newVal = isNaN(newVal) ? 0 : newVal;
    SetInputError(balance < value);
    SetDepositAmount(newVal);
  };

  const handleCoinSelected = (index) => {
    SetSelectedCoinIndex(index);
    SetOpenCoinSelecting(false);
  };
  return (
    <Box sx={{ color: "white" }}>
      <Grid container>
        <Grid item xs={12}>&nbsp;</Grid>

        <Grid container style={{margin: "32px 0px", minHeight: "175px"}}>
          <Grid item xs={12}>
            <Box
              mt={2}
              sx={{
                display: "flex",
                fontWeight: "600",
              }}
            >
              Deposit
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
              }}
            >
              <Box
                sx={{
                  width: "60%",

                }}
              >
                Deposit funds into this strategy.
              </Box>
              <Box
                sx={{
                  width: "40%",
                  textAlign: "end",
                  // fontWeight: "550",
                }}
              >
                Available: {coinBalances[strategyData.tokens[selectedCoinIndex]]}{" "}
                {strategyData.tokens[selectedCoinIndex]}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            &nbsp;
          </Grid>
          <Grid item xs={12} style={{position: "relative"}}>
            <StyledTextField
              value={depositAmount}
              onChange={(e) => onInputChange(e.target.value)}
              error={inputError}
            />
            <Box
              sx={{
                cursor: "pointer",
                position: "absolute",
                right: "12px",
                top: "15px"
              }}
              onClick={() => SetOpenCoinSelecting(!openCoinSelection)}
            >
              <div style={{display: "flex", alignItems:"center"}}>
                  <img
                    src={stableCoinLogos[strategyData.tokens[selectedCoinIndex]]}
                    className={classes.logoStableCoins}
                    alt=""
                  />
                  <span style={{marginLeft: "4px"}}>{strategyData.tokens[selectedCoinIndex]}</span>
                  <ArrowDropDownIcon />
              </div>
            </Box>
            {openCoinSelection && (
              <Box
                sx={{
                  position: "absolute",
                  right: "12px",
                  marginLeft: "auto",
                  marginTop: "-10px",
                  float: "right",
                  padding: "15px 0 15px 0px",
                  background: "#191E2C",
                  zIndex: 5,
                  borderRadius: "24px",
                }}
              >
                {strategyData.tokens.map((token, index) => {
                  return (
                    <Box
                      onClick={() => handleCoinSelected(index)}
                      key={index}
                      sx={{
                        display: "flex",
                        padding: "0 15px 0 15px",
                        cursor: "pointer",
                        ":hover": {
                          background: "#375894",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          marginRight: "4px",
                        }}
                      >
                        <img
                          src={stableCoinLogos[token]}
                          className={classes.logoStableCoins}
                          alt=""
                        />
                      </Box>
                      <Box
                        sx={{
                          marginLeft: "5px",
                        }}
                      >
                        {token}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
              }}
            >
              <Box
                sx={{
                  width: "40%",
                  marginLeft: "20px",
                  color: "red",
                }}
              >
                {inputError && <Typography>Invalid Amount</Typography>}
              </Box>
              <Box
                sx={{
                  width: "60%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingRight: "1rem",
                  fontWeight: "600",
                }}
              >
                {scales.map((scale, index) => {
                  return (
                    <span
                      key={index}
                      className={
                        index !== 4
                          ? classes.assetScaleLabel
                          : classes.assetMaxlabel
                      }
                      onClick={() => selectPercentage(scale.value)}
                    >
                      {scale.label}
                    </span>
                  );
                })}
              </Box>
            </Box>
          </Grid>
        </Grid>
      
        <Grid item xs={12}>
          &nbsp;
          <ActionConfirm
            open={open}
            handleClose={handleClose}
            titleMain={"Approve Deposit"}
            subTitle={`in ${strategyData.name}`}
            content={
              <DepositTemplate
                strategyInfo={strategyData}
                amount={depositAmount}
                vault={vaultContract}
                closeDialog={handleClose}
                getStableCoinWalletDetails={getStableCoinWalletDetails}
                logo={stableCoinLogos[strategyData.tokens[selectedCoinIndex]]}
                stableCoinsContractData={
                  stableCoinsContracts[
                    strategyData.erc20addresses[selectedCoinIndex].toLowerCase()
                  ]
                }
                getShareAndUSDValue={getShareAndUSDValue}
                account={account}
                symbol={strategyData.tokens[selectedCoinIndex]}
              />
            }
          />
        </Grid>
        <Grid item xs={12}>
          <StyledButton
            onClick={confirmDeposit}
            disabled={inputError || !depositAmount}
          >
            Deposit
          </StyledButton>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Deposit;
