import {Fragment} from 'react';

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Grid
} from '@mui/material';
import {styled} from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    makeStyles
} from '@mui/styles';
import StrategyDetails from './StrategyDetails';

import Asset1 from '../../assets/logos/asset1.png';
import Asset2 from '../../assets/logos/asset2.png';
import Asset3 from '../../assets/logos/asset3.png';

const StyledAccordion = styled(Accordion)(({theme}) => ({
    '&.MuiPaper-root': {
        background: 'transparent',
        borderRadius: '26px',
        border: 0,
        boxShadow: 'none'
    }
}));

const useStyles = makeStyles((theme) => ({
    assetImages: {
        height: '30px',
        marginLeft: '-10px',
        borderRadius: '50%'
    }
}));

const StyledAccordionSummary = styled(AccordionSummary)(({theme}) => ({
    '&.MuiAccordionSummary-root': {
        background: 'rgba(39, 62, 112, 0.25)',
        borderRadius: '26px',
        border: 0
    }
}));

const TokenName = styled(Typography)((theme) => ({
    '&.MuiTypography-root': {
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '18px',
        lineHeight: '22px',
        alignItems: 'center',
        position: 'absolute',
        top: '28%',
        left: '10%',
        color: '#FFFFFF'
    }
}));

const ValueLabel = styled(Typography)((theme) => ({
    '&.MuiTypography-root': {
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '18px',
        lineHeight: '18px',
        alignItems: 'left',
        position: 'absolute',
        top: '28%',
        color: '#FFFFFF'
    }
}));

const RoiLabel = styled(Typography)((theme) => ({
    '&.MuiTypography-root': {
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '18px',
        lineHeight: '18px',
        alignItems: 'right',
        position: 'absolute',
        top: '28%',
        color: '#15C73E'
    }
}));


function Strategy({
                    asset
                  }) {
    const classes = useStyles();
    return <Fragment>
        <StyledAccordion>
            <StyledAccordionSummary
                expandIcon={<ExpandMoreIcon fill={'red'}/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Grid container>
                    <Grid xs={3}>
                        <img src={Asset1} className={classes.assetImages} alt=""/>
                        <img src={Asset2} className={classes.assetImages} alt=""/>
                        <img src={Asset3} className={classes.assetImages} alt=""/>
                        <TokenName variant='body'>
                            Investing Strategy #1
                        </TokenName>
                    </Grid>
                    <Grid xs={3}>
                        <ValueLabel>
                            $12345678.89
                        </ValueLabel>
                    </Grid>
                    <Grid xs={3}>
                        <ValueLabel>
                            $12345678.89
                        </ValueLabel>
                    </Grid>
                    <Grid xs={3}>
                        <RoiLabel>
                            47%
                        </RoiLabel>
                    </Grid>
                </Grid>
            </StyledAccordionSummary>
            <AccordionDetails>
                <StrategyDetails/>
            </AccordionDetails>
        </StyledAccordion>
    </Fragment>
}

export default Strategy;