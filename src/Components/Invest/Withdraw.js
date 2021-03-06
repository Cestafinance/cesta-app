import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Grid, Box, TextField, Button, Typography } from "@mui/material";
import { styled, makeStyles } from "@mui/styles";
import { scales } from "../../Constants/utils";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  getDepositAmountFromContract,
  getPricePerFullShare,
} from "../../store/interactions/vaults";
import { getWalletAmount } from "../../store/interactions/stableCoins";
import { accountSelector, web3Selector } from "../../store/selectors/web3";
import { stableCoinsSelector } from "../../store/selectors/commons";
import ActionConfirm from "./modals/Modal";
import WithdrawTemplate from "./modals/WithDraw";
import DepositTemplate from "./modals/Deposit";
import useGAEventsTracker from "../../Analytics/useGAEventsTracker";
import useValidateInput from "../../Hooks/useValidate";
import useShares from "../../Hooks/useShares";

const useStyles = makeStyles(({ theme }) => ({
  assetScaleLabel: {
    margin: "0.3rem",
    cursor: "pointer",
  },
  assetSelectedlabel: {
    marginLeft: "0.3rem",
    cursor: "pointer",
    background: "#375894",
    borderRadius: "10px",
    padding: "0 6px",
  },
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
  selectedPercentage: {
    background: "#375894",
    borderRadius: "32px",
    padding: "2px",
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

function WithDraw({
  strategyData,
  vaultContract,
  coinBalances,
  stableCoinLogos,
  getShareAndUSDValue,
  depositedAmount,
  depositedShares,
  sharesInfo
}) {
  const classes = useStyles();

  const [openCoinSelection, SetOpenCoinSelecting] = useState(false);
  const [inputError, SetInputError] = useState(false);
  const [selectedCoinIndex, SetSelectedCoinIndex] = useState(0);
  const [amountToWithdraw, SetAmountToWithdraw] = useState(0);
  // const [selectedPercentage, SetSelectedPercentage] = useState(null);
  const [valueSelected, SetValueSelected] = useState(0);
  const [toWithdrawShares, SetToWithdrawShares] = useState(0);
  const [open, SetOpen] = useState(false);

  const account = useSelector(accountSelector);
  const stableCoinsContracts = useSelector(stableCoinsSelector);
  const GAEventsTracker = useGAEventsTracker("Withdraw Modal");

  const { validateInput } = useValidateInput();
  const { calculateSharesToWithdraw } = useShares();

  const selectPercentage = (value) => {
    let amt = depositedAmount * (value / 100);
    if(parseFloat(value) !== 100) {
      // Make the amount as 4 decimals, 100 percent is excluded, since deposited amount are in 4 decimals already
      amt = Math.floor(amt * 10000 ) / 10000; 
    }
    SetValueSelected(value);
    validateWithdrawAmount(amt);
  };

  const onInputChange = (value) => {
    validateWithdrawAmount(value);
  };

  const validateWithdrawAmount = (value) => {
    const {
      amount, 
      error,
      info
    } = validateInput({ value , tokenBalance: depositedAmount});

    SetAmountToWithdraw(amount);
    SetInputError(error);

    return { amount, error, info };
  }

  const handleClose = () => {
    SetOpen(false);
  };

  const withdrawNow = async () => {
    // Validate amount to withdraw before proceed with smart contract interaction
    const { error } = validateWithdrawAmount(amountToWithdraw);

    if(!error) {
      const {
        sharesToWithdrawRaw,
      } = await calculateSharesToWithdraw({ sharesInfo, amountToWithdraw });
  
      SetToWithdrawShares(sharesToWithdrawRaw);
  
      GAEventsTracker(
        "Opened",
        strategyData.tokens[selectedCoinIndex],
        amountToWithdraw
      );
      SetOpen(true);
    }

  };

  const handleResetInput = () => {
    // Reset withdraw amount input as 0 once transaction is done.
    SetAmountToWithdraw(0)
  }

  const handleCoinSelected = (index) => {
    SetSelectedCoinIndex(index);
    SetOpenCoinSelecting(false);
    SetAmountToWithdraw(0);
    SetValueSelected(null);
  };

  return (
    <Box sx={{ color: "white" }}>
      <Grid container>
        <Grid item xs={12}>
          &nbsp;
        </Grid>

        <Grid container style={{ margin: "32px 0px", minHeight: "175px" }}>
          <Grid item xs={12}>
            <Box
              mt={2}
              sx={{
                display: "flex",
                fontWeight: "600",
              }}
            >
              Withdraw
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
                  // fontWeight: "600",
                }}
              >
                Withdraw funds from this strategy.
              </Box>
              <Box
                sx={{
                  width: "40%",
                  textAlign: "end",
                  // fontWeight: "550",
                }}
              >
                Available: {depositedAmount}{" "}
                {strategyData.tokens[selectedCoinIndex]}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            &nbsp;
          </Grid>
          <Grid item xs={12} style={{ position: "relative" }}>
            <StyledTextField
              onChange={(e) => onInputChange(e.target.value)}
              value={amountToWithdraw}
              error={inputError}
            />
            <Box
              sx={{
                cursor: "pointer",
                position: "absolute",
                right: "12px",
                top: "15px",
              }}
              onClick={() => SetOpenCoinSelecting(!openCoinSelection)}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={stableCoinLogos[strategyData.tokens[selectedCoinIndex]]}
                  className={classes.logoStableCoins}
                  alt=""
                />
                <span style={{ marginLeft: "8px" }}>
                  {" "}
                  {strategyData.tokens[selectedCoinIndex]}
                </span>
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
                      className={
                        valueSelected === scale.value
                          ? classes.assetSelectedlabel
                          : classes.assetScaleLabel
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
            titleMain={"Confirm Withdrawal"}
            subTitle={`from ${strategyData.name}`}
            content={
              <WithdrawTemplate
                strategyInfo={strategyData}
                amount={amountToWithdraw}
                shares={toWithdrawShares}
                vault={vaultContract}
                closeDialog={handleClose}
                getShareAndUSDValue={getShareAndUSDValue}
                logo={stableCoinLogos[strategyData.tokens[selectedCoinIndex]]}
                stableCoinsContractData={
                  stableCoinsContracts[
                    strategyData.erc20addresses[selectedCoinIndex].toLowerCase()
                  ]
                }
                account={account}
                symbol={strategyData.tokens[selectedCoinIndex]}
                resetInput={handleResetInput}
              />
            }
          />
        </Grid>
        <Grid item xs={12}>
          <StyledButton
            onClick={withdrawNow}
            disabled={inputError || !amountToWithdraw}
          >
            Withdraw
          </StyledButton>
        </Grid>
      </Grid>
    </Box>
  );
}

export default WithDraw;
