import { Fragment } from "react";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";
import StakeScreen from "../../assets/screens/stake.png";

const useStyles = makeStyles((theme) => ({
  comingSoon: {
    display: "block",
    width: "auto",
    height: "auto",
    maxWidth: "50vw",
    maxHeight: "50vh",
  },
}));
function Stake() {
  const classes = useStyles();

  return (
    <Fragment>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10rem 5rem",
        }}
      >
        <img src={StakeScreen} alt="" className={classes.comingSoon} />
      </Box>
    </Fragment>
  );
}

export default Stake;
