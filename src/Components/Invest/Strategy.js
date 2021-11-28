import {Fragment} from 'react';

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Grid
} from '@mui/material';
import {styled} from "@mui/material/styles";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StyledAccordion = styled(Accordion)(({theme}) => ({
    '&.MuiPaper-root': {
        background: 'transparent',
        borderRadius: '26px',
        border: 0,
        boxShadow: 'none'
    }
}));

const StyledAccordionSummary = styled(AccordionSummary)(({theme}) => ({
    '&.MuiAccordionSummary-root': {
        background: 'rgba(39, 62, 112, 0.25)',
        borderRadius: '26px',
        border: 0
    }
}));


function Strategy() {
    return <Fragment>
        <StyledAccordion>
            <StyledAccordionSummary
                expandIcon={<ExpandMoreIcon fill={'red'}/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Grid container>
                    <Grid>

                    </Grid>
                </Grid>
            </StyledAccordionSummary>
            <AccordionDetails>
                <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                </Typography>
            </AccordionDetails>
        </StyledAccordion>
    </Fragment>
}

export default Strategy;