import {Fragment, useState} from "react";
import { makeStyles } from "@mui/styles";
import {Box, Grid, Tab, Tabs, Typography} from "@mui/material";
import StakeScreen from "../../assets/screens/stake.png";
import {styled} from "@mui/material/styles";
import Deposit from "../Invest/Deposit";
import WithDraw from "../Invest/Withdraw";

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

const StyledStakeLabel = styled(Typography)(({ theme }) => ({
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

const StyledTabs = styled(Tabs)(({ theme }) => ({
    "& .MuiTabs-indicator": {
        borderBottom: "2px solid #FFFFFF !important",
    },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    "&.MuiTab-root": {
        color: "#FFFFFF",
        borderBottom: "2px solid rgba(255, 255, 255, 0.34)",
        marginRight: "10px",
    },
}));

function Stake() {
  const classes = useStyles();
    const [selectedTab, SetSelectedTab] = useState(0);

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
                             <Box>
                                 Test
                             </Box>
                              <Box>
                                  Test1
                              </Box>
                          </Box>
                      </Grid>
                      <Grid item xs={4}>
                          <Box>
                              Test
                          </Box>
                          <Box>
                              Test1
                          </Box>
                      </Grid>
                      <Grid item xs={4}>
                          <Box>
                              Test
                          </Box>
                          <Box>
                              Test1
                          </Box>
                      </Grid>
                      <Grid item xs={12} sx={{
                          background: "rgba(39, 62, 112, 0.25)",
                          borderRadius: "26px",
                          height: "50px"
                      }}>
                      </Grid>
                      <Grid item xs={4} sx={{
                          padding: "10px"
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
                                  <Grid item xs={6}>
                                      YOUR BALANCE
                                  </Grid>
                                  <Grid item xs={6}>
                                  </Grid>
                                  <Grid item xs={6}>
                                      YOUR BALANCE
                                  </Grid>
                                  <Grid item xs={6}>
                                  </Grid>
                                  <Grid item xs={12}>
                                      &nbsp;
                                  </Grid>
                                  <Grid item xs={12}>
                                      &nbsp;
                                  </Grid>
                                  <Grid item xs={6}>
                                      YOUR BALANCE
                                  </Grid>
                                  <Grid item xs={6}>
                                  </Grid>
                                  <Grid item xs={6}>
                                      YOUR BALANCE
                                  </Grid>
                                  <Grid item xs={6}>
                                  </Grid>
                                  <Grid item xs={6}>
                                      YOUR BALANCE
                                  </Grid>
                                  <Grid item xs={6}>
                                  </Grid>
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
                          }}>
                              <Box
                                  sx={{
                                      border: "1px solid rgba(255, 255, 255, 0.2)",
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
                                      <StyledTab label="Stake" />
                                      <StyledTab label="Unstake" />
                                  </StyledTabs>
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
