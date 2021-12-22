import { useState } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    TableRow,
    Typography,
    Box
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import ArrowDown from '../../assets/commons/arrow-down.png';
import bond from "src/helpers/bond";
import Price from "./Price";
import Action from "./Action";
import { LoadingPulse } from "../Commons/SharedComponent";

const useStyles = makeStyles((theme) => ({
    assetImages: {
        height: "30px",
    },
    downArrow: {
        height: '8px',
        marginBottom: '4px'
    },
    textAlignStart: {
        "&.MuiTypography-root": {
            textAlign: "start"
        }
    },
    priceContainer: {
        width: "40%",
        marginRight: "16px",
        [theme.breakpoints.down('md')]: {
            width: "100%",
            marginRight: "0px",
        },
    },
    actionContainer: {
        width: "60%",
        [theme.breakpoints.down('md')]: {
            width: "100%",
        }
    },
    containerLayout: {
        border: "1px solid  rgba(255, 255, 255, 0.2)",
        borderRadius: "26px",

    }
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
    "&.MuiPaper-root": {
        background: "transparent",
        borderRadius: "26px",
        border: 0,
        boxShadow: "none",
    },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
    "&.MuiAccordionSummary-root": {
        background: "rgba(39, 62, 112, 0.25)",
        borderRadius: "1.5rem",
        border: 0,
        margin: "10px 0 10px 0"
    },
}));

const DetailLabel = styled(Typography)(({ theme }) => ({
    "&.MuiTypography-root": {
        fontFamily: "Inter",
        color: "#ffffff"
    },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({theme}) => ({
    display:"flex",
    flexDirection:"row",
    "&.MuiAccordionDetails-root": {
      padding: '8px 0 8px 0'
    },
    [theme.breakpoints.down('md')]: {
        flexDirection: "column",
    }
}))

function BondDetail({
    bondData, 
    loadingDetail
}) {
    const classes = useStyles();
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabSelected = (event) => {
        console.log(event);
        setSelectedTab(event);
    }

    return <TableRow>
        <StyledAccordion
            expanded={isExpanded}
            onChange={() => { setIsExpanded(!isExpanded) }}
        >
            <StyledAccordionSummary
                expandIcon={
                    <Box
                    sx={{
                      background: "rgba(39, 62, 112, 0.25)",
                      borderRadius: "50%",
                      height: "24px",
                      width: "24px",
                      padding: '4px'
                    }}
                  >
                    <img src={ArrowDown} alt="" className={classes.downArrow}/>
                  </Box>
                }
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Grid container sx={{ padding: '0 20px 0 20px', textAlign:"start"}}>
                    {/** Info */}
                    <Grid item xs={6}>
                        <Box sx={{display:"flex", alignItems: "center"}}>
                            <img src={"https://via.placeholder.com/30"} className={classes.assetImages} alt={bond.name} />
                            <DetailLabel variant="body" sx={{marginLeft: "8px", fontWeight: "bold"}}>{bondData.displayName}</DetailLabel>} 
                        </Box>
                    </Grid>

                    {/** Price */}
                    <Grid item xs={2} className={classes.textAlignStart}>
                        {loadingDetail 
                            ? <LoadingPulse skeletonWidth={100}/>
                            : <DetailLabel component={"span"}>
                                {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    maximumFractionDigits: 3,
                                    minimumFractionDigits: 2,
                                }).format(Number(bondData.bondPrice).toFixed(2))}
                            </DetailLabel>}
                    </Grid>

                    {/** ROI */}
                    <Grid item xs={2} className={classes.textAlignStart}>
                        {loadingDetail 
                            ? <LoadingPulse skeletonWidth={100}/>
                            : <DetailLabel component={"span"}>
                                {Number(bondData.bondDiscount).toFixed(2)}
                            </DetailLabel>}
                    </Grid>

                    {/** Purchased */}
                    <Grid item xs={2} className={classes.textAlignStart}>
                        {loadingDetail 
                            ? <LoadingPulse skeletonWidth={100} /> 
                            : <DetailLabel component={"span"}>
                                {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    maximumFractionDigits: 3,
                                    minimumFractionDigits: 2,
                                }).format(Number(bondData.purchased).toFixed(2))}
                        </DetailLabel>}
                    </Grid>
                </Grid>
            </StyledAccordionSummary>
            
            <StyledAccordionDetails>
                <div className={`${classes.containerLayout} ${classes.priceContainer}`}>
                    <Price tab={selectedTab} expanded={isExpanded} bondData={bondData}/>
                </div>
                <div className={`${classes.actionContainer} ${classes.containerLayout}`}>
                    <Action bondData={bondData} onTabSelected={handleTabSelected}/>
                </div>
            </StyledAccordionDetails>
        </StyledAccordion>
    </TableRow>
}

export default BondDetail;