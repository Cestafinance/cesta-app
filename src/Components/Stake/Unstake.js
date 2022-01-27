import {Fragment, useEffect, useState} from "react";
import {makeStyles, styled} from "@mui/styles";
import {Box, Button, Grid, Tab, Tabs, TextField, Typography} from "@mui/material";
import {
    getForceClaimInfo,
    getSafeClaimInfo
} from '../../store/interactions/stake'
import {scales} from "../../Constants/utils";
import ActionConfirm from "./modals/Modal";
import UnStakeTemplate from "./modals/Withdraw";
import Decimal from "decimal.js";
import {useSelector} from "react-redux";
import {accountSelector} from "../../store/selectors/web3";


const useStyles = makeStyles((theme) => ({}));

Decimal.set({ precision: 4, rounding: 4 })

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


function Unstake({
                    fsCestaBalance,
                     stakeContract,
                     tokenContract
                 }) {

    const classes = useStyles();

    const [inputError, SetInputError] = useState(false);
    const [unstakeAmount, SetUnstakeAmount] = useState(0);
    const [valueSelected, SetValueSelected] = useState(0);
    const [open, SetOpen] = useState(false);
    const account = useSelector(accountSelector);


    const onInputChange = (value) => {
        let decimals = value.match(/\./g);
        if (decimals && decimals.length > 1) {
            return value;
        }
        if (
            (decimals && decimals.length === 1 && value[value.length - 1] === ".") ||
            value[value.length - 1] === "0"
        ) {
            SetUnstakeAmount(value);
            return;
        }
        let newVal = parseFloat(value);
        newVal = isNaN(newVal) ? 0 : newVal;
        // SetInputError(balance < value);
        SetUnstakeAmount(newVal);
    };

    const getClaimInfoData = async () => {
        if(!stakeContract) {
            return;
        }
        const forceClaimData = await getForceClaimInfo(stakeContract.contract, account);
    }

    useEffect(() => {
        getClaimInfoData();
    }, [stakeContract]);

    const selectPercentage = (value) => {
        SetValueSelected(value);
        let amount = new Decimal(fsCestaBalance.toString()).div(new Decimal(10).pow(tokenContract.decimals));
        amount = amount.mul(new Decimal(value)).div(new Decimal(100));
        SetUnstakeAmount(amount.toFixed(4));
        SetInputError(false);
    };

    const handleClose = () => {
        SetOpen(false);
    };

    const confirmDeposit = () => {
        SetOpen(true);
    }

    return <Box sx={{ color: "white" }}>
        <Grid container>
            <Grid item xs={12}>
                &nbsp;
            </Grid>

            <Grid container>
                <Grid item xs={12}>
                    &nbsp;
                </Grid>
                <Grid item xs={12} style={{ position: "relative" }}>
                    <StyledTextField
                        value={unstakeAmount}
                        onChange={(e) => onInputChange(e.target.value)}
                        error={inputError}
                    />
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
                <Grid item xs={12}>
                    &nbsp;
                </Grid>
                <Grid item xs={12}>
                    <StyledButton
                        onClick={confirmDeposit}
                        disabled={inputError || !unstakeAmount}
                    >
                        Unstake
                    </StyledButton>
                </Grid>
                <Grid>
                    <ActionConfirm
                        open={open}
                        handleClose={handleClose}
                        titleMain={"Confirm Unstake"}
                        subTitle={``}
                        content={<UnStakeTemplate
                            amount={unstakeAmount}
                            stakeContractInfo={stakeContract}
                            tokenContractInfo={tokenContract}
                        />}
                    />
                </Grid>
            </Grid>
        </Grid>
    </Box>

}

export default Unstake;