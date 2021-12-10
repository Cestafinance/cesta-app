import { Fragment, useState } from "react";

import { Grid, Box, TextField, Button } from "@mui/material";
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
  },
}));

function Deposit({
  strategyData,
  getStableCoinWalletDetails,
  vaultContract,
  coinBalances,
  stableCoinLogos,
                   getShareAndUSDValue
}) {
  const classes = useStyles();

  const [openCoinSelection, SetOpenCoinSelecting] = useState(false);
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

    if (
      (decimals && decimals.length === 1 && value[value.length - 1] === ".") ||
      value[value.length - 1] === "0"
    ) {
      SetDepositAmount(value);
      return;
    }
    let newVal = parseFloat(value);
    SetDepositAmount(isNaN(newVal) ? 0 : newVal);
  };


  const handleCoinSelected = (index) => {
    SetSelectedCoinIndex(index);
    SetOpenCoinSelecting(false)
  }


  return (
    <Box sx={{ color: "white" }}>
      <Grid container>
        <Grid item xs={12}>
          &nbsp;
        </Grid>
        <Grid item xs={12}>
          <Box
            mt={2}
            sx={{
              display: "flex",
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
                width: "50%",
              }}
            >
              Deposit funds into this strategy.
            </Box>
            <Box
              sx={{
                width: "50%",
                textAlign: "end",
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
        <Grid item xs={12}>
          <StyledTextField value={depositAmount} error={false}  onChange={(e) => onInputChange(e.target.value)} />
          <Box
            sx={{
              cursor: "pointer",
            }}
            onClick={() => SetOpenCoinSelecting(!openCoinSelection)}
          >
            <Box
              sx={{
                position: "absolute",
                right: "135px",
                marginLeft: "auto",
                marginTop: "-38px",
                float: "right",
              }}
            >
              <img
                src={stableCoinLogos[strategyData.tokens[selectedCoinIndex]]}
                className={classes.logoStableCoins}
                alt=""
              />
            </Box>
            <Box
              sx={{
                position: "absolute",
                right: "85px",
                marginLeft: "auto",
                marginTop: "-37px",
                float: "right",
              }}
            >
              {strategyData.tokens[selectedCoinIndex]}
            </Box>
            <Box
              sx={{
                position: "absolute",
                right: "60px",
                marginLeft: "auto",
                marginTop: "-39px",
                float: "right",
              }}
            >
              <ArrowDropDownIcon />
            </Box>
          </Box>
          {openCoinSelection && (
            <Box
              sx={{
                position: "absolute",
                right: "60px",
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
                width: "50%",
              }}
            ></Box>
            <Box
              sx={{
                width: "70%",
                // textAlign: "end",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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
          <StyledButton variant={"contained"} onClick={confirmDeposit}>
            Deposit
          </StyledButton>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Deposit;
