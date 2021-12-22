import { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import {useTheme} from "@mui/material/styles";
import {styled} from "@mui/material/styles";
import {
  Grid, 
  Typography, 
  Box, 
  TableContainer, 
  Paper, 
  Table,
  TableBody, 
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { 
  BannerBox
} from "../Commons/SharedComponent";
import { useInitiateBonds } from "./Hooks/useInitialBonds";
import useBonds from "src/Hooks/bonds";
import BondDetail from "./BondDetail";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    background: theme.palette.app.main,
    width: `100%`,
    height: `auto`,
    color: "white",
    padding: "60px 0px 0px 240px",
    [theme.breakpoints.down("sm")]: {
      width: `96%`,
      padding: "60px 0px 0px 0",
    }
  },
  contentContainer:{
    "&.MuiGrid-root":{
      margin: "0px 120px",
    },
    [theme.breakpoints.down('md')]: {
      "&.MuiGrid-root":{
        margin: "0px 20px",
      },
    }
  }
}));

const StyledBondLabel = styled(Typography)(({theme}) => ({
  '&.MuiTypography-root': {
      float: 'left',
      marginLeft: '25px',
      marginTop: '40px',
      fontFamily: 'Inter',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '24px',
      lineHeight: '14px',
      color: '#FFFFFF'
  }
}));

export const MainInfoContainer = styled(Box)(({theme})  => ({
  padding: "32px 0px", 
  display: "flex",
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  color: "white",
  justifyContent: "center",
  [theme.breakpoints.down('sm')]: {
    flexDirection: "column",
  }
}))

export const InfoContainer = styled(Box)(({theme})  => ({
  margin: "0px 32px",
  [theme.breakpoints.down('sm')]: {
    marginTop:"24px"
  }
}))

export const UpperLabel = styled(Typography)(({theme})  => ({
  fontFamily: "Inter",
  fontSize: "20px",
})) 

export const LowerLabel = styled(Typography)(({theme})  => ({
  fontFamily: "Inter",
  fontSize: "18px",
  fontWeight: "bold"
})) 

const StyledTableContainer = styled(TableContainer)(({theme}) => ({
  "&.MuiPaper-root": {
      backgroundColor: theme.palette.app.main,
      padding: "40px",
      overflowY: "hidden",
  },
}));

const StyledTableCell = styled(TableCell)(({theme}) => ({
  color: "white",
}));

function Bond() {
  const classes = useStyles();
  const theme = useTheme();

  const { findBonds } = useInitiateBonds();
  const bonds = useBonds();

  const [bondList, setBondList] = useState([]);
  const [isLoadingBondList, setIsLoadingBondList] = useState(false);

  useEffect(() => {
    findBonds();
  }, [])

  useEffect(() => {
    setBondList(bonds.bonds);
    setIsLoadingBondList(bonds.loading);
  },[bonds])

  return (
    <div className={classes.mainContainer}>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid container>
        <Grid item xs={12}>
          <BannerBox>
            <StyledBondLabel>Bond</StyledBondLabel>
          </BannerBox>
        </Grid>

        <Grid item xs={12} className={classes.contentContainer}>
          <MainInfoContainer>
              {/** Treasure Balance */}
              <InfoContainer sx={{margin: "0px 32px"}}>
                <UpperLabel>Treasure Balance</UpperLabel>
                <LowerLabel>$21,466,879</LowerLabel>
              </InfoContainer>

              {/** CESTA Price */}
              <InfoContainer sx={{margin: "0px 32px"}}>
                <UpperLabel>CESTA Price</UpperLabel>
                <LowerLabel>$21,466,879</LowerLabel>
              </InfoContainer>
          </MainInfoContainer>

          <StyledTableContainer component={Paper}>
            <Table
              sx={{ backgroundColor: theme.palette.app.main, color: "white" }}
              aria-label="simple table"
            >
              {/** Table Column Label */}
              <TableHead>
                <TableRow>
                  <StyledTableCell colSpan={4}>
                    <Grid container sx={{ padding: '0 20px 0 20px' }}>
                      <Grid item xs={6}>
                        <Typography component={'span'}>Bond</Typography>
                      </Grid>

                      <Grid item xs={2}  sx={{marginLeft:"-13PX"}}>
                        <Typography component={'span'}>Price</Typography>
                      </Grid>

                      <Grid item xs={2}>
                        <Typography component={'span'}>ROI</Typography>
                      </Grid>

                      <Grid item xs={2} sx={{marginLeft:"-4PX"}}>
                        <Typography component={'span'}>Purchased</Typography>
                      </Grid>
                    </Grid>
                  </StyledTableCell>
                </TableRow>
              </TableHead>

              {/** Table Content */}
              <TableBody>
                {bondList.map((bond, index) => {
                    return (
                      <BondDetail bondData={bond} loadingDetail={isLoadingBondList}/>
                    )
                })}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Grid>
      </Grid>
    </div>
  );
}

export default Bond;
