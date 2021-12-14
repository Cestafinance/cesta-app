import {
    Suspense,
    useState, lazy
} from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import {useDispatch} from "react-redux";
import Sidebar from './Components/Commons/Sidebar';
import Topbar from './Components/Commons/Topbar';
import WalletConnect from './Components/WalletConnector';
import {
    getAllStableCoinsContract
} from './Services/contracts';
import {
    contractLoad
} from './store/interactions/stableCoins';
import './App.css';
import {
    networkMap
} from './Constants/mains';
import useBonds from "./hooks/bonds";
import useTokens from "./hooks/tokens";

const Invest = lazy(() => import('./Components/Invest'));
const Bond = lazy(() => import('./Components/Bond'));
const Stake = lazy(() => import('./Components/Stake'));

function App() {

    const dispatch = useDispatch();

    const [coinLoaded, SetAllCoinsLoaded] = useState(false);

    const { bonds } = useBonds();
    const { tokens } = useTokens();
    console.log('bonds', bonds);
    console.log('tokens', tokens);

    const blockChainInit = async (web3, networkId) => {
        try {
            const response = await getAllStableCoinsContract(networkMap[networkId] ? networkMap[networkId] : '');
            const contractsData = {};
            const stableCoinsData = response.data;
            for (let i = 0; i < stableCoinsData.length; i++) {
                let contract = await contractLoad(dispatch, web3, stableCoinsData[i].abi, stableCoinsData[i].address.toLowerCase(), {
                    name: stableCoinsData[i].name,
                    symbol: stableCoinsData[i].symbol,
                    decimals: stableCoinsData[i].decimals
                });
                contractsData[stableCoinsData[i].address.toLowerCase()] = {
                    contract,
                    name: stableCoinsData[i].name,
                    symbol: stableCoinsData[i].symbol,
                    decimals: stableCoinsData[i].decimals,
                    address: stableCoinsData[i].address
                }
            }
            SetAllCoinsLoaded(true);
        } catch (Err) {
            console.log(Err);

        }
    }

    return (
        <div className="App">
            <Router>
                <Sidebar/>
                <Topbar/>
                <WalletConnect loadContracts={blockChainInit}/>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route
                            exact
                            path={"/"}
                            element={coinLoaded && <Navigate to="/invest"/>}
                        />
                        <Route
                            exact
                            path={'/invest'}
                            element={coinLoaded && <Invest/>}
                        />
                        <Route
                            exact
                            path={'/bond'}
                            element={coinLoaded && <Bond/>}
                        />
                        <Route
                            exact
                            path={'/stake'}
                            element={coinLoaded && <Stake/>}
                        />

                    </Routes>
                </Suspense>
            </Router>

        </div>
    );
}

export default App;
