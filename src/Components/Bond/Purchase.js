import { useState } from "react";
import { styled, makeStyles } from "@mui/styles";
import { scales } from "../../Constants/utils";
import { TextField, Typography, Box } from "@mui/material";
import { StyledButton } from "../Invest/Deposit";
import { ErrorText } from "../Commons/SharedComponent";

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
        width: "100%"
    }
}));

function ScaleButtons({
    onPercentSelected
}) {
    const classes = useStyles();

    const [selectedValue, setSelectedValue] = useState(null);

    const handlePercentSelected = (scale) => {
        setSelectedValue(scale);
        onPercentSelected({percent: scale});
    }
    return <Box
            sx={{
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
                        selectedValue === scale.value
                            ? classes.assetSelectedlabel
                            : classes.assetScaleLabel
                    }
                    onClick={() => handlePercentSelected(scale.value)}
                >
                    {scale.label}
                </span>
            );
        })}
    </Box>
}

function Purchase({  
    availableBalance
}) {
    const classes = useStyles();

    const [amount, setAmount] = useState(0);
    const [error, setError] = useState(false);

    const onInputChange = (value) => {
        let decimals = value.match(/\./g);
        if (decimals && decimals.length > 1) {
          return value;
        }
        // let balance = parseFloat(
        //   coinBalances[strategyData.tokens[selectedCoinIndex]]
        // );
        let balance = 0;
        if (
          (decimals && decimals.length === 1 && value[value.length - 1] === ".") ||
          value[value.length - 1] === "0"
        ) {
            setError(balance < value);
            setAmount(value);
            return;
        }
        let newVal = parseFloat(value);
        newVal = isNaN(newVal) ? 0 : newVal;
        setError(balance < value);
        setAmount(newVal);
    };

    const handlePercentSelected = ({percent}) => {
        console.log(percent);
    }

    return <div style={{color: "#ffffff", width: "100%"}}>
        <div style={{ position: "relative" }}>
            <StyledTextField
                value={amount}
                onChange={(e) => onInputChange(e.target.value)}
                error={error}
            />

            <Box sx={{
                cursor: "pointer",
                position: "absolute",
                right: "24px",
                top: "15px",
            }}>
                <div style={{display: "flex", alignItems:"center"}}>
                    <img src={"https://via.placeholder.com/20"} alt="token"/>
                    <span style={{marginLeft: "8px"}}>AVAX</span>
                </div>
            </Box>
        </div>

        <div className={classes.errorContainer}>
            <div style={{width:"60%"}}>   
                {error && <ErrorText sx={{textAlign: "start"}}>Invalid Error</ErrorText>}
            </div>
           
            <div style={{width:"40%"}}>
                <ScaleButtons onPercentSelected={handlePercentSelected}/>
            </div>
        </div>

        <div style={{margin:"24px 0px"}}>
            <StyledButton>
                BOND
            </StyledButton>
        </div>
    </div>
}

export default Purchase;

