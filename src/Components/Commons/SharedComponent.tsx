import { styled, Typography, Skeleton } from "@mui/material";
import { Box } from "@mui/system";
import { makeStyles } from "@mui/styles";


const useStyles = makeStyles((theme) => ({
    downArrow: {
      height: '8px',
      marginBottom: '4px'
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
