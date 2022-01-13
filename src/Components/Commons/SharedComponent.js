import { useState } from "react";
import { styled, Typography, Skeleton } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { Box, fontFamily } from "@mui/system";
import { makeStyles } from "@mui/styles";
import { scales } from "../../Constants/utils";
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import CheckIcon from '@mui/icons-material/Check';

const useStyles = makeStyles((theme) => ({
    downArrow: {
      height: '8px',
      marginBottom: '4px'
    },
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
    bondProcessingTemplateText: {
        "&.MuiTypography-root": {
            fontSize: "16px",
            fontFamily: "Inter",
            marginTop: "24px",
            fontWeight: "bold"
        }
    }
}));

export const BannerBox = styled(Box)(({theme}) => ({
    background: 'linear-gradient(134.64deg, #EF7B6E 6.08%, #AB4863 34.8%, #1F224D 71.27%, #152E64 98.89%)',
    border: '1px solid  #152E64',
    boxSizing: 'border-box',
    borderRadius: '26px',
    height: '100px',
    margin: '20px',
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

export const ErrorText = styled(Typography)(({theme}) => ({
    color: "red",
    fontFamily: "Inter",
    fontWeight:"bold"
}));

const Loading = styled(Skeleton)(({theme}) => ({
    background:  "#7367b7"
}));

export const LoadingPulse = ({ skeletonWidth = 60}) => {
    return <Loading animation="pulse" variant="text" width={skeletonWidth}/>
}

export const ScaleButtons = ({onPercentSelected}) => {
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
                paddingRight: "12px",
                fontWeight: "600",
                overflow: "overlay"
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

export const BondProcessingTemplate = ({ message, subMessage = null, subMessage2 = null, isError = false, isTransacting = true }) => {
    const classes = useStyles();

    return <div style={{width: "100%", display: "flex", alignItems: "center", justifyContent:"center", minHeight: "160px", flexDirection:"column", textAlign: "center"}}>
        {isTransacting && !isError && <CircularProgress/>}
        {!isTransacting && !isError && <CheckIcon sx={{color:"#ffffff", width: "44px", height: "44px"}}/>}
        {!isTransacting && isError && <SentimentVeryDissatisfiedIcon sx={{color:"red", width: "44px", height: "44px"}}/>}

        <Typography className={classes.bondProcessingTemplateText} sx={{color: `${isError ? "red" : 'rgba(255, 255, 255, 0.61)'}`}}>
            {message}
            {subMessage && <span style={{display: "block"}}>{subMessage}</span>}
            {subMessage2 && <span style={{display: "block"}}>{subMessage2}</span>}
        </Typography>
    </div>
}