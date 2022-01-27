import {Fragment, useEffect, useState} from "react";
import Web3 from "web3";
import {makeStyles} from "@mui/styles";
import {Box, Grid, Tab, Tabs, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import Decimal from "decimal.js";
import Deposit from "./Deposit";
import Unstake from "./Unstake";
import {getStakeContracts} from "../../Services/contracts";
import {useDispatch, useSelector} from "react-redux";
import {accountSelector, networkIdSelector, web3Selector} from "../../store/selectors/web3";
import {networkMap} from "../../Constants/mains";
import {
    loadCestaTokenContract,
    loadStakingTokenContract,
    loadStakingContract,
    distributorContract
} from "../../store/interactions/stake";
import {
    getWalletAmount
} from "../../store/interactions/stableCoins";

const useStyles = makeStyles((theme) => ({
    comingSoon: {
        display: "block",
        width: "auto",
        height: "auto",
        maxWidth: "50vw",
        maxHeight: "50vh",
    },
    mainContainer: {
        background: theme.palette.app.main,
        width: `100%`,
        height: `100%`,
        color: "white",
        padding: "60px 0px 0px 240px",
        [theme.breakpoints.down("sm")]: {
            width: `96%`,
            padding: "60px 0px 0px 0",
        },
    },
}));

const StyledStakeLabel = styled(Typography)(({theme}) => ({
    "&.MuiTypography-root": {
        float: "left",
        marginLeft: "25px",
        marginTop: "40px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: "24px",
        lineHeight: "14px",
        color: "#FFFFFF",
    },
}));

const StyledTabs = styled(Tabs)(({theme}) => ({
    "& .MuiTabs-indicator": {
        borderBottom: "2px solid #FFFFFF !important",
    },
}));

const StyledTab = styled(Tab)(({theme}) => ({
    "&.MuiTab-root": {
        color: "#FFFFFF",
        borderBottom: "2px solid rgba(255, 255, 255, 0.34)",
        marginRight: "10px",
    },
}));

const InfoLabel = styled(Typography)(() => ({
    "&.MuiTypography-root": {
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "18px",
        lineHeight: "14px",
        color: "#FFFFFF",
    },
}));

const InfoDetails = styled(Typography)(() => ({
    "&.MuiTypography-root": {
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: "700",
        fontSize: "18px",
        lineHeight: "14px",
        color: "#FFFFFF",
    },
}));

const StakingLabel = styled(Typography)(() => ({
    "&.MuiTypography-root": {
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: "18px",
        lineHeight: "10px",
        color: "#FFFFFF",
    },
}));

const StakingInfo = styled(Typography)(() => ({
    "&.MuiTypography-root": {
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "12px",
        lineHeight: "10px",
        color: "#FFFFFF",
    },
}));

const DetailsText = styled(Typography)(() => ({
    "&.MuiTypography-root": {
        fontFamily: "Rubik",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "18px",
        lineHeight: "25px",
        color: "rgba(255, 255, 255, 0.6)",
    },
}));

function Stake() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const BN = Web3.utils.BN;
    const [selectedTab, SetSelectedTab] = useState(0);
    const [cestaBalanceBN, SetCestaBalanceBN] = useState(new BN(0));
    const [cestaDecimalBalance, SetCestaDecimalBalance] = useState(new Decimal("0"));
    const [stakedBalanceBN , SetStakedBalanceBN] = useState(new BN(0));

    const [tokenContract, SetTokenContract] = useState(null);
    const [stakeTokenContract, SetStakeTokenContract] = useState(null);
    const [stakeContract, SetStakeContract] = useState(null);
    const [distributionContract, SetDistributionContract] = useState(null);

    const networkId = useSelector(networkIdSelector);
    const web3 = useSelector(web3Selector);
    const account = useSelector(accountSelector);

    const bootstrapContracts = async () => {
        const response = await getStakeContracts(networkMap[networkId]);
        const contracts = response.data;

        let cestaTokenInfo ,stakingToken , stakingContract, distributionContract;

        contracts.forEach((contract) => {
            if(contract.type === "TOKEN") {
                cestaTokenInfo = contract;
            } else if(contract.type === "STAKING-TOKEN") {
                stakingToken = contract;
            } else if(contract.type === "STAKING-CONTRACT") {
                stakingContract = contract;
            } else if(contract.type === "DISTRIBUTOR-CONTRACT") {
                distributionContract = contract;
            }
        });

        if(!cestaTokenInfo || !stakingToken || !stakingContract || !distributionContract) {
            return;
        }

        const cestaTokenContractInfo = await loadCestaTokenContract(dispatch, web3, cestaTokenInfo.abi, cestaTokenInfo.address, {
            name: cestaTokenInfo.name,
            symbol: cestaTokenInfo.symbol,
            decimals: cestaTokenInfo.decimal
        });

        const stakingTokenContractInfo = await loadStakingTokenContract(dispatch, web3, stakingToken.abi, stakingToken.address, {
            name: stakingToken.name,
            symbol: stakingToken.symbol,
            decimals: stakingToken.decimal
        });

        const stakingContractInfo = await loadStakingContract(dispatch, web3, stakingContract.abi, stakingContract.address);

        const distributionContractInfo = await distributorContract(dispatch, web3, distributionContract.abi, distributionContract.address);

        const balance = await getWalletAmount(cestaTokenContractInfo.contract, account);
        const stakingTokenBalance = await getWalletAmount(stakingTokenContractInfo.contract, account);
        const TVL = await getWalletAmount(cestaTokenContractInfo.contract, stakingContract.address);
        SetCestaBalanceBN(new BN(balance));
        SetStakedBalanceBN(new BN(stakingTokenBalance));
        SetCestaDecimalBalance(new Decimal(balance).div(new Decimal(10).pow(cestaTokenContractInfo.decimals)))
        SetTokenContract(cestaTokenContractInfo);
        SetStakeTokenContract(stakingTokenContractInfo);
        SetStakeContract(stakingContractInfo);
        SetDistributionContract(distributionContractInfo);

    }

    useEffect(() => {
        bootstrapContracts();
    }, []);

    return (
        <div className={classes.mainContainer}>
            <Grid container>
                <Grid item xs={12}>
                    &nbsp;
                </Grid>
                <Grid item xs={12}>
                    <Box
                        sx={{
                            background:
                                "linear-gradient(134.64deg, #EF7B6E 6.08%, #AB4863 34.8%, #1F224D 71.27%, #152E64 98.89%)",
                            border: "1px solid  #152E64",
                            boxSizing: "border-box",
                            borderRadius: "26px",
                            height: "100px",
                            margin: "20px",
                        }}
                    >
                        <StyledStakeLabel component={"span"}>Stake</StyledStakeLabel>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    &nbsp;
                </Grid>
                <Grid item xs={12}>
                    <Grid container sx={{
                        padding: "100px"
                    }}>
                        <Grid item xs={4}>
                            <Box sx={{display: "flex", flexDirection: "column"}}>
                                <Box sx={{padding: "10px"}}>
                                    <InfoLabel>
                                        APY
                                    </InfoLabel>
                                </Box>
                                <Box>
                                    <InfoDetails>
                                        2,662.35%
                                    </InfoDetails>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box sx={{padding: "10px"}}>
                                <InfoLabel>
                                    TVL
                                </InfoLabel>
                            </Box>
                            <Box>
                                <InfoDetails>
                                    $21,499,879
                                </InfoDetails>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box sx={{padding: "10px"}}>
                                <InfoLabel>
                                    Current Index
                                </InfoLabel>
                            </Box>
                            <Box>
                                <InfoDetails>
                                    6.45 CESTA
                                </InfoDetails>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{
                            background: "rgba(39, 62, 112, 0.25)",
                            borderRadius: "26px",
                            height: "70px",
                            marginTop: "20px",
                            padding: "10px"
                        }}>
                            <Grid container>
                                <Grid item xs={12} sx={{textAlign: "start", marginLeft: "30px"}}>
                                    <StakingLabel component="span">
                                        CESTA Staking (3,3)
                                    </StakingLabel>
                                </Grid>
                                <Grid item xs={12} sx={{textAlign: "start", marginLeft: "30px"}}>
                                    <StakingInfo component="span">
                                        5 Hours, 23 Mins to next Rebase
                                    </StakingInfo>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={4} sx={{
                            padding: "10px 0"
                        }}>
                            <Box sx={{
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                boxSizing: "border-box",
                                borderRadius: "26px",
                            }}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        &nbsp;
                                    </Grid>
                                    <Grid item xs={12}>
                                        &nbsp;
                                    </Grid>
                                    <Grid item xs={1}>
                                    </Grid>
                                    <Grid item xs={5} sx={{
                                        textAlign: "start",
                                    }}>
                                        <DetailsText>
                                            Your Balance
                                        </DetailsText>
                                    </Grid>
                                    <Grid item xs={5} sx={{
                                        textAlign: "end",
                                    }}>
                                        <DetailsText>
                                            {cestaDecimalBalance.toString()} CESTA
                                        </DetailsText>
                                    </Grid>
                                    <Grid item xs={1}>
                                    </Grid>

                                    <Grid item xs={1}>
                                    </Grid>
                                    <Grid item xs={5} sx={{
                                        textAlign: "start",
                                    }}>
                                        <DetailsText>
                                            Your Staked Balance
                                        </DetailsText>
                                    </Grid>
                                    <Grid item xs={5} sx={{
                                        textAlign: "end",
                                    }}>
                                        <DetailsText>
                                            50 fsCESTA
                                        </DetailsText>
                                    </Grid>
                                    <Grid item xs={1}>
                                    </Grid>
                                    <Grid item xs={12}>
                                        &nbsp;
                                    </Grid>
                                    <Grid item xs={12}>
                                        &nbsp;
                                    </Grid>

                                    <Grid item xs={1}>
                                    </Grid>
                                    <Grid item xs={4} sx={{
                                        textAlign: "start",
                                    }}>
                                        <DetailsText>
                                            Exchange Rate
                                        </DetailsText>
                                    </Grid>
                                    <Grid item xs={6} sx={{
                                        textAlign: "end",
                                    }}>
                                        <DetailsText>
                                            1 gCESTA = 123.389 CESTA
                                        </DetailsText>
                                    </Grid>
                                    <Grid item xs={1}>
                                    </Grid>

                                    <Grid item xs={1}>
                                    </Grid>
                                    <Grid item xs={5} sx={{
                                        textAlign: "start",
                                    }}>
                                        <DetailsText>
                                            Next Reward Amount
                                        </DetailsText>
                                    </Grid>
                                    <Grid item xs={5} sx={{
                                        textAlign: "end",
                                    }}>
                                        <DetailsText>
                                            1200 CESTA
                                        </DetailsText>
                                    </Grid>
                                    <Grid item xs={1}>
                                    </Grid>

                                    <Grid item xs={1}>
                                    </Grid>
                                    <Grid item xs={5} sx={{
                                        textAlign: "start",
                                    }}>
                                        <DetailsText>
                                            Next Reward Yield
                                        </DetailsText>
                                    </Grid>
                                    <Grid item xs={5} sx={{
                                        textAlign: "end",
                                    }}>
                                        <DetailsText>
                                            10.24%
                                        </DetailsText>
                                    </Grid>
                                    <Grid item xs={1}>
                                    </Grid>

                                    <Grid item xs={1}>
                                    </Grid>
                                    <Grid item xs={5} sx={{
                                        textAlign: "start",
                                    }}>
                                        <DetailsText>
                                            ROI (5-DAY RATE)
                                        </DetailsText>
                                    </Grid>
                                    <Grid item xs={5} sx={{
                                        textAlign: "end",
                                    }}>
                                        <DetailsText>
                                            65.25%
                                        </DetailsText>
                                    </Grid>
                                    <Grid item xs={1}>
                                    </Grid>
                                    { selectedTab === 1 && <Grid item xs={12}>
                                        &nbsp;
                                    </Grid>}
                                    {selectedTab === 1 && <Fragment>
                                        <Grid item xs={1}>
                                        </Grid>
                                        <Grid item xs={5} sx={{
                                            textAlign: "start",
                                        }}>
                                            <DetailsText>
                                                Unstake Reward Penalty
                                            </DetailsText>
                                        </Grid>
                                        <Grid item xs={5} sx={{
                                            textAlign: "end",
                                        }}>
                                            <DetailsText>
                                                10345
                                            </DetailsText>
                                        </Grid>
                                        <Grid item xs={1}>
                                        </Grid>
                                    </Fragment>}
                                    {selectedTab === 1 && <Fragment>
                                        <Grid item xs={1}>
                                        </Grid>
                                        <Grid item xs={5} sx={{
                                            textAlign: "start",
                                        }}>
                                            <DetailsText>
                                                Penalty Time Remaining
                                            </DetailsText>
                                        </Grid>
                                        <Grid item xs={5} sx={{
                                            textAlign: "end",
                                        }}>
                                            <DetailsText>
                                                5 Days 4 Hours
                                            </DetailsText>
                                        </Grid>
                                        <Grid item xs={1}>
                                        </Grid>
                                    </Fragment>}
                                    <Grid item xs={12}>
                                        &nbsp;
                                    </Grid>
                                    <Grid item xs={12}>
                                        &nbsp;
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                        <Grid item xs={8} sx={{
                            padding: "10px",
                        }}>
                            <Box sx={{
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                boxSizing: "border-box",
                                borderRadius: "26px",
                                height: "100%",
                            }}>
                                <Box
                                    sx={{
                                        borderRadius: "20px",
                                        padding: "20px",
                                        height: "100%",
                                    }}
                                >
                                    <StyledTabs
                                        value={selectedTab}
                                        onChange={(event, newValue) => SetSelectedTab(Number(newValue))}
                                        indicatorColor="secondary"
                                        textColor="inherit"
                                        variant="fullWidth"
                                        aria-label="full width tabs example"
                                    >
                                        <StyledTab label="Stake"/>
                                        <StyledTab label="Unstake"/>
                                    </StyledTabs>
                                    {selectedTab === 0 && <Deposit
                                        tokenContract={tokenContract}
                                        stakeContract={stakeContract}
                                        cestaBalance={cestaBalanceBN}/>}
                                    {selectedTab === 1 && <Unstake
                                        tokenContract={tokenContract}
                                        stakeContract={stakeContract}
                                        fsCestaBalance={cestaBalanceBN}
                                    />}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default Stake;
