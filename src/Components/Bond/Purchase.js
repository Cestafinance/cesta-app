import { useState, useEffect } from "react";
import { styled, makeStyles } from "@mui/styles";
import { TextField, Box } from "@mui/material";
import { StyledButton } from "../Invest/Deposit";
import {
  ErrorText,
  ScaleButtons,
  BondProcessingTemplate,
} from "../Commons/SharedComponent";
import { useDispatch, useSelector } from "react-redux";
import ActionConfirm from "../Invest/modals/Modal";
import { ReminderText } from "./Redeem";
import { messages } from "../../Constants/messages";
import useDebounce from "../../Hooks/debounce";
import {
  bondAsset,
  changeApproval,
  calcBondExtraDetails,
} from "../../store/slices/bond-slice";
import {
  accountSelector,
  networkIdSelector,
  providerSelector,
} from "src/store/selectors/web3";

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

const useStyles = makeStyles((theme) => ({
  logoStableCoins: {
    height: "20px",
    marginTop: "2px",
  },

  errorContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "15px",
    alignItems: "center",
    width: "100%",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  },

  errorContainerItems: {
    width: "50%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
}));

function Purchase({ bondData, expanded }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const transaction = useSelector((state) => state.bondTransaction.transaction);

  const provider = useSelector(providerSelector);
  const networkID = useSelector(networkIdSelector);
  const account = useSelector(accountSelector);

  const [amount, setAmount] = useState(0);
  const [error, setError] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [requireApprove, setRequireApprove] = useState(false);

  const [isTransacting, setIsTransacting] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [modalProps, setModalProps] = useState(null);
  const [contentProps, setContentProps] = useState(null);

  const closeModal = () => {
    setTimeout(() => {
      setOpenModal(false);
      setIsTransacting(false);
    }, 2000);
  };

  useEffect(() => {
    if (!expanded) {
      setAmount(0);
    }
  }, [expanded]);

  useEffect(() => {
    setRequireApprove(
      bondData.allowance !== undefined ? bondData.allowance <= 0 : false
    );
    setTokenBalance(bondData.balance ? bondData.balance : 0);
  }, [bondData.allowance, bondData.balance]);

  useEffect(() => {
    if (["approve", "bond"].includes(transaction.type)) {
      // Transaction Error
      if (transaction.isError) {
        setContentProps({
          message:
            transaction.type === "approve"
              ? messages.approve_failed
              : messages.bond_failed,
          subMessage: messages.failed_sub,
          isTransacting: false,
          isError: true,
        });

        // Close Modal
        closeModal();
      } else {
        // Successful approval
        if (transaction.isTransacting && transaction.transactionCompleted) {
          setContentProps({
            message:
              transaction.type === "approve"
                ? messages.approve_successful
                : messages.bond_successful_main,
            subMessage:
              transaction.type === "approve"
                ? ""
                : `${messages.bond_successful_sub} ${bondData.bondToken}`,
            isTransacting: false,
            isError: false,
          });

          // Close Modal
          closeModal();
        }

        // No ongoing transaction
        if (!transaction.isTransacting && transaction.txHash === undefined) {
          setContentProps({
            message: null,
            subMessage: null,
            isTransacting: false,
            isError: false,
          });
        }
      }
    }
  }, [transaction]);

  const bondDetailsDebounce = useDebounce(amount, 1000);
  useEffect(() => {
    if (!error && bondDetailsDebounce !== undefined) {
      dispatch(
        calcBondExtraDetails({
          bond: bondData,
          value: amount.toString(),
          provider,
          networkID,
        })
      );
    }
  }, [amount, bondDetailsDebounce]);

  const validateInput = (value) => {
    const pattern = /^[0-9]\d*(\.\d+)?$/; // Accept only decimals or integer
    const isDigit = pattern.test(value);

    if (!isDigit) {
      setError(true);
      setAmount(value);

      return false;
    }

    if (value === "" || value === null || value === undefined || value === 0) {
      setError(true);
      setAmount(0);

      return false;
    }

    let newAmount = value;
    const sufficientBalance = newAmount <= tokenBalance;

    setError(!sufficientBalance);
    setAmount(newAmount);

    return sufficientBalance;
  };

  const onInputChange = (value) => {
    validateInput(value);
  };

  const handlePercentSelected = ({ percent }) => {
    const newAmount =
      (Math.floor(tokenBalance * 1000) / 1000) * (percent / 100);
    setAmount(newAmount);
  };

  const onApproveToken = async () => {
    const valid = validateInput(amount);
    if (valid) {
      setIsTransacting(true);
      setModalProps({
        titleMain: "Approve Bond",
        subTitle: `for Bond Contract ${bondData.bondToken}`,
      });
      setOpenModal(true);

      setContentProps({
        message: messages.approve_transacting,
        subMessage: null,
        isTransacting: true,
        isError: false,
      });

      dispatch(
        changeApproval({
          bond: bondData,
          provider,
          networkID,
          address: account,
        })
      );
    }
  };

  const onBonding = async () => {
    if (Number(amount) === 0 || isNaN(amount)) {
      setError(true);
      return;
    }

    if (bondData.pendingPayout > 0 || bondData.interestDue > 0) {
      const shouldProceed = window.confirm(messages.existing_mint);
      if (!shouldProceed) {
        return;
      }
    }

    setIsTransacting(true);
    setModalProps({
      titleMain: "Purchase Bond",
      subTitle: `for Bond Contract ${bondData.bondToken}`,
    });
    setOpenModal(true);

    setContentProps({
      message: messages.bond_transacting,
      subMessage: messages.bond_transacting_sub,
      isTransacting: true,
      isError: false,
    });

    dispatch(
      bondAsset({
        value: amount.toString(),
        slippage: null, // TODO: Slippage setting
        bond: bondData,
        networkID,
        provider,
        address: account,
        useAvax: false,
      })
    );
  };

  return (
    <div style={{ color: "#ffffff", width: "100%" }}>
      <div style={{ position: "relative" }}>
        <StyledTextField
          value={amount}
          onChange={(e) => onInputChange(e.target.value)}
          error={error}
        />

        <Box
          sx={{
            cursor: "pointer",
            position: "absolute",
            right: "24px",
            top: "15px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={"https://via.placeholder.com/20"} alt="token" />
            <span style={{ marginLeft: "8px" }}>{bondData.bondToken}</span>
          </div>
        </Box>
      </div>

      <div className={classes.errorContainer}>
        <div className={classes.errorContainerItems}>
          {error && (
            <ErrorText sx={{ textAlign: "start" }}>Invalid Amount</ErrorText>
          )}
        </div>

        <div className={classes.errorContainerItems}>
          <ScaleButtons onPercentSelected={handlePercentSelected} />
        </div>
      </div>

      <div style={{ margin: "20px 0px" }}>
        <StyledButton
          disabled={isTransacting || error}
          onClick={() => (requireApprove ? onApproveToken() : onBonding())}
        >
          {requireApprove ? "APPROVE" : "BOND"}
        </StyledButton>

        <ReminderText sx={{ marginTop: "16px", color: "grey" }}>
          {tokenBalance > 0 && requireApprove && (
            <span>{`First time bonding ${bondData.bondToken} ? Please approve Cesta Finance to use your ${bondData.bondToken} for bonding.`}</span>
          )}
        </ReminderText>
      </div>

      <ActionConfirm
        open={openModal}
        handleClose={() => setOpenModal(!openModal)}
        {...modalProps}
        content={<BondProcessingTemplate {...contentProps} />}
      />
    </div>
  );
}

export default Purchase;
