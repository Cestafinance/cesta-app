import {
    Fragment,
    useState,
    useEffect
} from 'react';
import {
    useSelector
} from 'react-redux';

import {
    Grid,
    Typography,
    Box,
    Tabs,
    Tab,
} from '@mui/material';
import {makeStyles, styled} from '@mui/styles';
import MultiColorBar from '../Commons/MultiColorBar';
import Deposit from './Deposit';
import WithDraw from './Withdraw';
import {
    getWalletAmount
} from '../../store/interactions/stableCoins';
import {
    stableCoinsSelector
} from '../../store/selectors/commons';
import {
    networkIdSelector,
    accountSelector
} from '../../store/selectors/web3';
import {
    GraphTimeRanges
} from '../../Constants/mains';
import {
    getStrategyCoinDistribution
} from '../../Services/contracts';

import StrategyChart from './Chart';

const useStyles = makeStyles((theme) => ({
    roundBorder: {
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '20px',
        padding: '20px',
        marginTop: '30px !important'
    },
    paddingGrid: {
        padding: '20px',
        marginTop: '30px !important'
    },
    activeTimeRange: {
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


function StrategyDetails({
                             strategyData,
                             strategyContract,
                             vaultContract,
                             isExpanded,
                             depositedAmount,
                             getShareAndUSDValue,
                             depositedShares
                         }) {

    const classes = useStyles();

    const account = useSelector(accountSelector);
    const stableCoins = useSelector(stableCoinsSelector);

    const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
    const [selectedTab, SetSelectedTab] = useState(0);
    const [coinBalances, SetCoinBalances] = useState({});
    const [stableCoinLogos, SetStableCoinLogo] = useState({});
    const [coinDistributionData, SetCoinDistributionData] = useState([]);

    const onTimeRangeSelect = (value) => {
        setSelectedTimeRange(value);
    }

    const getImageData = async (symbol) => {
        try {
            const image = await import(`../../assets/tokens/${symbol}-logo.png`);
            return image.default;

        } catch (Err) {
            return '';
        }
    }

    const getStableCoinWalletDetails = async () => {
        const sbData = {}, imgData = {};
        for (let i = 0; i < strategyData.erc20addresses.length; i++) {
            const address = strategyData.erc20addresses[i].toLowerCase();
            const balance = await getWalletAmount(stableCoins[address].contract, account);
            sbData[stableCoins[address].symbol] = (balance / (10 ** stableCoins[address].decimals)).toFixed(4);
        }
        SetCoinBalances(sbData);

        for (let i = 0; i < strategyData.erc20addresses.length; i++) {
            const address = strategyData.erc20addresses[i].toLowerCase();
            const image = await getImageData(stableCoins[address].symbol);
            imgData[stableCoins[address].symbol] = image;
        }
        SetStableCoinLogo(imgData);
    }

    const getCoinDistribution = async () => {
        try {
            const distributionResponse = await getStrategyCoinDistribution(strategyData.performanceId);
            const distributionData = distributionResponse.data;
            SetCoinDistributionData(distributionData);

        } catch (Err) {
            console.log(Err);
        }
    }

    useEffect(() => {
        if (isExpanded) {
            getStableCoinWalletDetails();
            getCoinDistribution()
        }
    }, [isExpanded]);

    return <Fragment>
        <Grid
            container
            columnSpacing={3}
            rowSpacing={1}
        >
            <Grid item xs={12}>
                <Box sx={{
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    padding: '20px',
                }}>
                    <Grid
                        container
                    >
                        <Grid item xs={6}>
                            <Box sx={{
                                padding: '20px',
                            }}>
                                <StrategyDescription>
                                    {strategyData.description}
                                </StrategyDescription>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{
                                padding: '20px 20px 0 20px',
                            }}>
                                <MultiColorBar coins={coinDistributionData}/>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid item md={6} sm={12} className={classes.paddingGrid}>
                <Box sx={{
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    padding: '20px',
                }}>
                    <Grid
                        container
                    >
                        <Grid item xs={12}>
                            <Box sx={{
                                textAlign: 'end'
                            }}>
                                {GraphTimeRanges.map((timeRange, index) => {
                                    return <TimerangeLabel variant='body' key={index}
                                                           className={selectedTimeRange === timeRange.value ? classes.activeTimeRange : ''}
                                                           onClick={() => onTimeRangeSelect(timeRange.value)}>
                                        {timeRange.label}
                                    </TimerangeLabel>
                                })}
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <StrategyChart {...{strategyData, isExpanded, selectedTimeRange}} />
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid item md={6} sm={12} className={classes.paddingGrid}>
                <Box sx={{
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    padding: '20px',
                    height: '100%'
                }}>
                    <StyledTabs
                        value={selectedTab}
                        onChange={(event, newValue) => SetSelectedTab(Number(newValue))}
                        indicatorColor="secondary"
                        textColor="inherit"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                    >
                        <StyledTab label="Deposit"/>
                        <StyledTab label="Withdraw"/>
                    </StyledTabs>
                    {selectedTab === 0 && <Deposit strategyData={strategyData}
                                                   strategyContract={strategyContract}
                                                   vaultContract={vaultContract}
                                                   coinBalances={coinBalances}
                                                   getStableCoinWalletDetails={getStableCoinWalletDetails}
                                                   getShareAndUSDValue={getShareAndUSDValue}
                                                   stableCoinLogos={stableCoinLogos}
                    />}
                    {selectedTab === 1 && <WithDraw strategyData={strategyData}
                                                    strategyContract={strategyContract}
                                                    vaultContract={vaultContract}
                                                    coinBalances={coinBalances}
                                                    getShareAndUSDValue={getShareAndUSDValue}
                                                    depositedAmount={depositedAmount}
                                                    depositedShares={depositedShares}
                                                    getStableCoinWalletDetails={getStableCoinWalletDetails}
                                                    stableCoinLogos={stableCoinLogos}
                    />}
                </Box>
            </Grid>
        </Grid>
    </Fragment>
}

export default StrategyDetails;