import {useState} from 'react';
import { useSelector } from "react-redux";
import { bondingSelector } from "../../store/selectors/web3";
import {
    Fade,
    Grid,
    Backdrop,
    Box,
    Skeleton
  } from "@mui/material";
import { trim } from '../../Util/trimUtil';

function Bond({ bond }) {
    // const { address } = useWeb3Context();

    const [slippage, setSlippage] = useState(0.5);

    const [view, setView] = useState(0);

    const isBondLoading = useSelector(bondingSelector);

    const onSlippageChange = (value) => {
        return setSlippage(value);
    };

    const changeView = (newView) => () => {
        setView(newView);
    };


    return (
        <Fade in={true} mountOnEnter unmountOnExit>
            <Grid className="bond-view">
                <Backdrop open={true}>
                    <Fade in={true}>
                        <div className="bond-card">
                            <BondHeader bond={bond} slippage={slippage} onSlippageChange={onSlippageChange} />
                            {/* @ts-ignore */}
                            <Box direction="row" className="bond-price-data-row">
                                <div className="bond-price-data">
                                    <p className="bond-price-data-title">Mint Price</p>
                                    <p className="bond-price-data-value">
                                        {isBondLoading ? <Skeleton /> : bond.isLP || bond.name === "wavax" ? `$${trim(bond.bondPrice, 2)}` : `${trim(bond.bondPrice, 2)} MIM`}
                                    </p>
                                </div>
                                <div className="bond-price-data">
                                    <p className="bond-price-data-title">TIME Price</p>
                                    <p className="bond-price-data-value">{isBondLoading ? <Skeleton /> : `$${trim(bond.marketPrice, 2)}`}</p>
                                </div>
                            </Box>

                            <div className="bond-one-table">
                                <div onClick={changeView(0)}>
                                    <p>Mint</p>
                                </div>
                                <div onClick={changeView(1)}>
                                    <p>Redeem</p>
                                </div>
                            </div>

                            <TabPanel value={view} index={0}>
                                <BondPurchase bond={bond} slippage={slippage} />
                            </TabPanel>

                            <TabPanel value={view} index={1}>
                                <BondRedeem bond={bond} />
                            </TabPanel>
                        </div>
                    </Fade>
                </Backdrop>
            </Grid>
        </Fade>
    );
}

export default Bond;