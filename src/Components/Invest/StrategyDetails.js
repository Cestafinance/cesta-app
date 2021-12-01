import {
    Fragment,
    useState
} from 'react';

import {
    Grid,
    Typography,
    Box,
    Tabs,
    Tab,
} from '@mui/material';
import {makeStyles, styled} from '@mui/styles';
import Chart from 'react-apexcharts';
import MultiColorBar from '../Commons/MultiColorBar';
import Deposit from './Deposit';
import WithDraw from './Withdraw';

import {
    GraphTimeRanges
} from '../../Constants/mains';

const useStyles = makeStyles((theme) => ({
    roundBorder: {
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '20px',
        padding: '20px',
        marginTop: '30px !important'
    },
    activeTimeRange:{
        background: '#273E70',
        borderRadius: '7px'
    },
    selectedTab: {
        borderBottom: '2px solid #FFFFFF !important'
    }
}));

const StrategyDescription = styled(Typography)(({theme}) => ({
    '&.MuiTypography-root': {
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: "14px",
        lineHeight: "17px",
        color: "#FFFFFF",
    }
}));

const TimerangeLabel = styled(Typography)(({theme}) => ({
    '&.MuiTypography-root': {
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: "14px",
        lineHeight: "17px",
        color: "#FFFFFF",
        padding: '3px',
        cursor: 'pointer'
    }
}));

const StyledTabs = styled(Tabs)(({theme}) => ({
    '& .MuiTabs-indicator': {
        borderBottom: '2px solid #FFFFFF !important'
    }
}))

const StyledTab = styled(Tab)(({theme}) => ({
    '&.MuiTab-root': {
        color: '#FFFFFF',
        borderBottom: '2px solid rgba(255, 255, 255, 0.34)',
        marginRight: '10px'
    },

}));


function StrategyDetails() {

    const classes = useStyles();

    const [selectedTimeRange, setSelectedTimeRange] = useState('1d');
    const [selectedTab, SetSelectedTab] = useState(0);
    const coins = [{
        percentage: '50%',
        label: 'ETH'
    }, {
        percentage: '50%',
        label: 'BTC'
    }];

    const onTimeRangeSelect = (value) => {
        setSelectedTimeRange(value);
    }

    return <Fragment>
        <Grid
            container
            columnSpacing={3}
            rowSpacing={1}
        >
            <Grid item xs={12} className={classes.roundBorder}>
                <Grid
                    container
                >
                    <Grid item xs={6}>
                        <StrategyDescription>
                            A balanced crypto portfolio with yield farming rewards
                            A basket of 3 DeFi publicly strong token been known to invest in.
                        </StrategyDescription>
                    </Grid>
                    <Grid item xs={6}>
                        <MultiColorBar coins={coins}/>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item md={6} sm={12} className={classes.roundBorder}>
                <Grid
                    container
                >
                    <Grid item xs={12}>
                        <Box sx={{
                            textAlign: 'end'
                        }}>
                            {GraphTimeRanges.map((timeRange) => {
                                return <TimerangeLabel variant='body' className={selectedTimeRange === timeRange.value?classes.activeTimeRange: ''} onClick={() => onTimeRangeSelect(timeRange.value)}>
                                    {timeRange.label}
                                </TimerangeLabel>
                            })}
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Chart  type={'area'} options={{
                            chart: {
                                id: "basic-bar",
                                toolbar: {
                                    show: false,
                                },
                            },
                            grid: {
                                show: false,
                            },
                            stroke: {
                                curve: 'smooth',
                            },
                            xaxis: {
                                categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
                            },
                            yaxis: {
                                opposite:true
                            },
                            dataLabels: {
                                enabled: false,
                            },
                            noData: {
                                text: undefined,
                                align: 'center',
                                verticalAlign: 'middle',
                                offsetX: 0,
                                offsetY: 0,
                                style: {
                                    color: undefined,
                                    fontSize: '14px',
                                    fontFamily: undefined,
                                },
                            },
                        }}
                                series={[
                                    {
                                        name: "series-1",
                                        data: [30, 40, 45, 50, 49, 60, 70, 91]
                                    }
                                ]}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item md={6} sm={12} className={classes.roundBorder}>
                <StyledTabs
                    value={selectedTab}
                    onChange={(event, newValue) => SetSelectedTab(Number(newValue))}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <StyledTab label="Deposit" />
                    <StyledTab label="Withdraw" />
                </StyledTabs>
                {selectedTab === 0 && <Deposit/>}
                {selectedTab === 1 && <WithDraw/>}
            </Grid>
        </Grid>
    </Fragment>
}

export default StrategyDetails;