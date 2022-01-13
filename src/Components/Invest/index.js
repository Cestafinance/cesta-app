import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { networkIdSelector, web3Selector } from "../../store/selectors/web3";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import {
  TableContainer,
  Table,
  TableBody,
  Typography,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Strategy from "./Strategy";
import { getAllStrategies } from "../../Services/contracts";
import { networkMap } from "../../Constants/mains";
import { loadVaultContract } from "../../store/interactions/vaults";
import { loadStrategyContract } from "../../store/interactions/strategies";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    background: theme.palette.app.main,
    width: `100%`,
    height: `100%`,
    color: "white",
    padding: "60px 0px 0px 240px",
    [theme.breakpoints.down("sm")]: {
      width: `96%`,
      padding: "60px 0px 0px 0px",
    },
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: "white",
}));

const StrategyTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: "none",
  "&.MuiTableCell-root": {
    padding: "8px 0 8px 0",
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  "&.MuiPaper-root": {
    backgroundColor: theme.palette.app.main,
    padding: "40px",
    overflowY: "hidden",
  },
}));

const StyledInvestLabel = styled(Typography)(({ theme }) => ({
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

function Invest() {
  const classes = useStyles();

  const networkId = useSelector(networkIdSelector);
  const web3 = useSelector(web3Selector);
  const [strategies, SetStrategies] = useState([]);
  const [vaultContracts, SetVaultContracts] = useState({});
  const [strategyContracts, SetStrategyContracts] = useState({});
  const theme = useTheme();
  const dispatch = useDispatch();

  const loadStrategies = async () => {
    if (!networkId) {
      SetStrategyContracts({});
      SetVaultContracts({});
      SetStrategies([]);
      return;
    }
    const response = await getAllStrategies(networkMap[networkId]);

    const strategies = response.data;
    const strategyContracts = {},
      vaultContracts = {};

    const GAEvent = (GAObject) => {};

    for (let i = 0; i < strategies.length; i++) {
      const strategyContract = await loadStrategyContract(
        dispatch,
        web3,
        strategies[i].abi,
        strategies[i].address,
        {
          name: strategies[i].name,
          symbol: strategies[i].symbol,
          decimals: strategies[i].decimals,
          vaultAddress: strategies[i].vaultAddress,
        }
      );

      strategyContracts[strategies[i].address] = {
        name: strategies[i].name,
        symbol: strategies[i].symbol,
        decimals: strategies[i].decimals,
        vaultAddress: strategies[i].vaultAddress,
        address: strategies[i].address,
        contract: strategyContract,
      };

      const vaultContract = await loadVaultContract(
        dispatch,
        web3,
        strategies[i].vaultInfo.abi,
        strategies[i].vaultInfo.address,
        {
          name: strategies[i].vaultInfo.name,
          symbol: strategies[i].vaultInfo.symbol,
          strategyAddress: strategies[i].address,
          decimals: strategies[i].decimals,
        }
      );

      vaultContracts[strategies[i].vaultInfo.address.toLowerCase()] = {
        name: strategies[i].vaultInfo.name,
        symbol: strategies[i].vaultInfo.symbol,
        strategyAddress: strategies[i].address,
        address: strategies[i].vaultInfo.address,
        decimals: strategies[i].decimals,
        contract: vaultContract,
      };
    }
    SetStrategyContracts(strategyContracts);
    SetVaultContracts(vaultContracts);
    SetStrategies(strategies);
  };

  useEffect(() => {
    SetStrategyContracts({});
    SetVaultContracts({});
    SetStrategies([]);
    loadStrategies();
  }, [networkId]);

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
            <StyledInvestLabel component={"span"}>Invest</StyledInvestLabel>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <StyledTableContainer component={Paper}>
            <Table
              sx={{ backgroundColor: theme.palette.app.main, color: "white" }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell colSpan={4}>
                    <Grid container sx={{ padding: "0 20px 0 20px" }}>
                      <Grid item xs={6}>
                        <Typography component={"span"}>Name</Typography>
                      </Grid>
                      <Grid item xs={2} sx={{ textAlign: "center" }}>
                        <Typography component={"span"}>Staked</Typography>
                      </Grid>
                      <Grid item xs={2} sx={{ textAlign: "center" }}>
                        <Typography component={"span"}>Liquidity</Typography>
                      </Grid>
                      <Grid item xs={2} sx={{ textAlign: "center" }}>
                        <Typography component={"span"}>APY</Typography>
                      </Grid>
                    </Grid>
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {strategies.map((strategy, index) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, th": { border: 0 } }}
                    >
                      <StrategyTableCell colSpan={4}>
                        <Strategy
                          strategyData={strategy}
                          strategyContract={
                            strategyContracts[strategy.address.toLowerCase()]
                          }
                          vaultContract={
                            vaultContracts[
                              strategy.vaultInfo.address.toLowerCase()
                            ]
                          }
                        />
                      </StrategyTableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Grid>
      </Grid>
    </div>
  );
}

export default Invest;
