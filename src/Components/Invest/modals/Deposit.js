import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Tooltip,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { makeStyles, styled } from "@mui/styles";
import { Info as InfoIcon } from "@mui/icons-material";
import fromExponential from "from-exponential";
import { web3Selector, sourceSelector } from "../../../store/selectors/web3";
import {
  checkAllowance,
  approveToken,
} from "../../../store/interactions/stableCoins";
import {
  calculateFee,
  depositTokenThreeParam,
} from "../../../store/interactions/vaults";
import { useSelector } from "react-redux";
import { useTokenMinPriceDeposit } from "../TokenMinPrice/hooks";
import DoneMark from "../../../assets/commons/done.png";
import Metamask from "../../../assets/commons/metaMask.png";

const LabelMessage = styled(Typography)(({ theme }) => ({
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: "bold",
  fontSize: "0.75rem",
  lineHeight: "0.8rem",
  color: "#D0D3D4",
  margin: "20px 0 20px 0",
}));

const BoxDetail = styled(Box)(({ theme }) => ({
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: "bold",
  fontSize: "1.25rem",
  color: "#D0D3D4",
  marginLeft: "0.5rem",
}));

const ApproveButton = styled(Button)(({ theme }) => ({
  "&.MuiButton-root": {
    background: "#4B86F2",
    borderRadius: "33px",
    width: "75%",
    color: "#FFFFFF",
    "&:hover": {
      background: "rgba(75, 134, 242, 0.4)",
    },
  },
}));

const DepositButton = styled(Button)(({ theme }) => ({
  "&.MuiButton-root": {
    background: "#4B86F2",
    borderRadius: "33px",
    width: "75%",
    color: "#FFFFFF",
    "&:hover": {
      background: "rgba(75, 134, 242, 0.4)",
    },
  },
}));

const AddToMetamaskButton = styled(Button)(({ theme }) => ({
  "&.MuiButton-root": {
    background: "#4B86F2",
    borderRadius: "33px",
    width: "75%",
    color: "#FFFFFF",
    marginBottom: "20px",
    marginTop: "20px",
    "&:hover": {
      background: "rgba(75, 134, 242, 0.4)",
    },
  },
}));

const useStyles = makeStyles(({ theme }) => ({
  label1: {
    marginBottom: "2rem",
  },
  alignRightAmount: {
    textAlign: "right",
    fontWeight: "575",
    fontSize: "1.25rem",
  },
  alignRight: {
    textAlign: "right",
    fontWeight: "575",
  },
  toolTip: {
    height: "15px !important",
    marginBottom: "-2px",
    marginLeft: "-4px",
  },
  logo: {
    height: "25px",
    marginTop: "3px",
  },
  metamaskLogo: {
    height: "25px",
  },
  transactionDetails: {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "420",
    color: "#D0D3D4",
  },
}));

function DepositTemplate({
  amount,
  vault,
  symbol,
  logo,
  stableCoinsContractData,
  account,
  strategyInfo,
  closeDialog,
  getStableCoinWalletDetails,
  getShareAndUSDValue,
}) {
  const classes = useStyles();
  const [needStrategyApproval, SetNeedStrategyApproval] = useState(false);
  const [checkingForApproval, SetCheckingForApproval] = useState(false);
  const [calculatingFees, SetCalculatingFees] = useState(false);
  const [hasApproved, SetHasApproved] = useState(false);
  const [isApproving, SetIsApproving] = useState(false);
  const [isApprovalError, SetIsApprovalError] = useState(false);
  const [isDepositing, SetDepositing] = useState(false);
  const [depositError, SetDepositError] = useState(false);
  const [depositCompleted, SetDepositCompleted] = useState(false);
  const [slippageWarningNeeded, SetSlippageWarningNeeded] = useState(true);
  const [slippageAccepted, SetSlippageAcceptance] = useState(false);
  const [feeInfo, SetFeeInformation] = useState({
    feePercentage: 0,
    fees: 0,
    finalAmount: 0,
  });

  const web3 = useSelector(web3Selector);
  const source = useSelector(sourceSelector);
  const { getTokenPriceMin } = useTokenMinPriceDeposit();

  const checkAllowanceApprovalNeeded = async () => {
    SetCheckingForApproval(true);
    const isApprovalNeeded = await checkAllowance(
      stableCoinsContractData.contract,
      vault.address,
      account,
      web3,
      amount
    );
    SetNeedStrategyApproval(isApprovalNeeded.needApproval);
    SetHasApproved(!isApprovalNeeded.needApproval);
    SetCheckingForApproval(false);
  };

  const watchAssetToken = async () => {
    let data = await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: vault.address,
          symbol: vault.symbol,
          decimals: vault.decimals,
        },
      },
    });
  };

  const getFeeInfo = async () => {
    SetCalculatingFees(true);
    const feeDataResponse = await calculateFee(
      vault.contract,
      strategyInfo.type,
      amount * 10 ** stableCoinsContractData.decimals
    );

    if (!feeDataResponse.success) {
      SetCalculatingFees(false);
      return null;
    }

    const feeAmount = ((amount * feeDataResponse.feePercent) / 100).toFixed(4);
    const finalAmount = (amount - feeAmount).toFixed(4);
    SetCalculatingFees(false);
    SetFeeInformation({
      feePercentage: feeDataResponse.feePercent,
      fees: feeAmount,
      finalAmount: finalAmount,
    });
  };

  const approveAmount = async () => {
    SetIsApproving(true);
    const approvalData = await approveToken(
      stableCoinsContractData.contract,
      strategyInfo.vaultAddress,
      account,
      web3
    );
    SetIsApproving(false);
    SetHasApproved(approvalData.success);
    SetIsApprovalError(!approvalData.success);
    SetNeedStrategyApproval(!approvalData.success);
  };

  const depositAmount = async () => {
    SetDepositing(true);
    const roundedAmount = Math.round(amount * 10 ** 4);
    const valueData =
      roundedAmount * 10 ** (stableCoinsContractData.decimals - 4);

    // To prevent "1.2e+21" being passed into deposit function, should be "1200000000000000000000" instead
    const finalAmountToDeposit = fromExponential(valueData);

    const tokenMinPrice = await getTokenPriceMin({
      strategy: strategyInfo,
      depositERC20Address: stableCoinsContractData.address,
      depositAmount: finalAmountToDeposit,
    });

    SetDepositError(false);
    const depositStatus = await depositTokenThreeParam(
      vault.contract,
      finalAmountToDeposit,
      stableCoinsContractData.address,
      tokenMinPrice,
      account
    );

    SetDepositing(false);
    if (depositStatus.success) {
      SetDepositError(false);
      SetDepositCompleted(true);
      getStableCoinWalletDetails();
      getShareAndUSDValue();
      setTimeout(() => {
        closeDialog();
      }, 5000);
    } else {
      SetDepositError(true);
      SetDepositCompleted(false);
    }
  };

  useEffect(() => {
    checkAllowanceApprovalNeeded();
    getFeeInfo();
  }, []);

  return (
    <Box sx={{ color: "#FFFFFF" }}>
      <Box
        sx={{
          width: "86%",
          background: "rgba(75, 134, 242, 0.4)",
          borderRadius: "16px",
          marginLeft: "7%",
          padding: "15px",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <LabelMessage>
            Kindly approve the transaction in your wallet
          </LabelMessage>
        </Box>

        <Box>
          <Grid container>
            <Grid item xs={12}></Grid>
            <Grid item xs={6} className={classes.label1}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box sx={{ width: "10%" }}>
                  <img src={logo} className={classes.logo} alt="" />
                </Box>
                <BoxDetail>{symbol}</BoxDetail>
              </Box>
            </Grid>
            <Grid item xs={6} className={classes.alignRightAmount}>
              {amount}
            </Grid>
            <Grid item xs={12}>
              <hr />
            </Grid>
            <Grid item xs={6} className={classes.transactionDetails}>
              Deposit
            </Grid>
            <Grid item xs={6} className={classes.alignRight}>
              {feeInfo.finalAmount} {symbol}
            </Grid>
            <Grid item xs={6} className={classes.transactionDetails}>
              Fee ({feeInfo.feePercentage}%){" "}
              <Tooltip
                className={classes.toolTip}
                title={"test"}
                placement="top-end"
              >
                <InfoIcon />
              </Tooltip>
            </Grid>
            <Grid item xs={6} className={classes.alignRight}>
              - {feeInfo.fees}
            </Grid>
            <Grid item xs={6} className={classes.transactionDetails}>
              Total
            </Grid>
            <Grid item xs={6} className={classes.alignRight}>
              {amount} {symbol}
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Box
        sx={{
          width: "86%",
          marginLeft: "7%",
          padding: "15px",
        }}
      >
        {slippageWarningNeeded && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <Box>
              <Checkbox
                sx={{ color: "rgb(255,255,255, 0.6)" }}
                onChange={(event) => {
                  SetSlippageAcceptance(event.target.checked);
                }}
              />
            </Box>
            <Box sx={{ lineHeight: "1.1" }}>
              {/* <AcceptTerms> */}I understand that my deposit may experience
              high slippage due to low liqudity
              {/* </AcceptTerms> */}
            </Box>
          </Box>
        )}
        {needStrategyApproval && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "3rem",
              lineHeight: "1",
              letterSpacing: "1",
            }}
          >
            <Box sx={{ width: "70%", fontSize: "1rem" }}>
              Allow your {symbol} to be depositted
              <br />
              in {strategyInfo.name}
            </Box>
            <Box sx={{ width: "30%", textAlign: "end" }}>
              <ApproveButton onClick={approveAmount} disabled={isApproving}>
                {isApproving ? <CircularProgress size={20} /> : "APPROVE"}
              </ApproveButton>
            </Box>
          </Box>
        )}

        {isDepositing && (
          <Box sx={{ display: "flex", textAlign: "center" }}>
            <Box sx={{ width: "100%" }}>
              Depositing your {symbol} <br />
              in {strategyInfo.name} <br />
            </Box>
          </Box>
        )}
        {depositError && (
          <Box sx={{ display: "flex", textAlign: "center", color: "red" }}>
            <Box sx={{ width: "100%" }}>
              Failed to deposit {symbol} <br />
              in {strategyInfo.name}. <br />
              Please try again
            </Box>
          </Box>
        )}

        {isApprovalError && (
          <Box sx={{ display: "flex", textAlign: "center", color: "red" }}>
            <Box sx={{ width: "100%" }}>
              Transaction Denied. Please try again
            </Box>
          </Box>
        )}

        {depositCompleted && (
          <Box sx={{ display: "flex", textAlign: "center" }}>
            <Box sx={{ width: "100%" }}>
              Your {symbol} has been deposited in {strategyInfo.name}
              successfully.
            </Box>
          </Box>
        )}

        {depositCompleted && source === "metaMask" && (
          <Box sx={{ display: "flex", textAlign: "center" }}>
            <Box sx={{ width: "100%" }}>
              <AddToMetamaskButton onClick={watchAssetToken}>
                Add Token to Meta mask &nbsp; &nbsp;{" "}
                <img
                  src={Metamask}
                  className={classes.metamaskLogo}
                  alt="meta mask"
                />
              </AddToMetamaskButton>
            </Box>
          </Box>
        )}
        <Box sx={{ textAlign: "center" }}>
          <DepositButton
            disabled={
              checkingForApproval ||
              isDepositing ||
              calculatingFees ||
              !hasApproved ||
              (slippageWarningNeeded && !slippageAccepted)
            }
            onClick={depositAmount}
          >
            {isDepositing ? (
              <CircularProgress size={20} />
            ) : depositCompleted ? (
              <img src={DoneMark} alt="Done" />
            ) : (
              "DEPOSIT"
            )}
          </DepositButton>
        </Box>
      </Box>
    </Box>
  );
}

export default DepositTemplate;
