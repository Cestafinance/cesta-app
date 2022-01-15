import { Suspense, useState, lazy, useEffect, useCallback } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
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
import { accountSelector, providerSelector, networkIdSelector, connectedSelector } from './store/selectors/web3';
import { calculateUserBondDetails, calculateUserTokenDetails, loadAccountDetails } from './store/slices/account-slice';
import { loadAppDetails } from './store/slices/app-slice';
import { loadTokenPrices } from "src/helpers/token-price";
import TagManager from "react-gtm-module";
import ReactGA from "react-ga";

const Invest = lazy(() => import("./Components/Invest"));
const Bond = lazy(() => import("./Components/Bond"));
const Stake = lazy(() => import("./Components/Stake"));

function App() {
  const dispatch = useDispatch();

  //Analytics Initialization
  useEffect(() => {
    hotjar.initialize(
      process.env.REACT_APP_HOTJAR_HJID,
      process.env.REACT_APP_HOTJAR_HJSV
    );
  });

  const tagManagerArgs = {
    gtmId: process.env.REACT_APP_GTM_TRACKING,
  };
  TagManager.initialize(tagManagerArgs);
  ReactGA.initialize(process.env.REACT_APP_GA_TRACKING);

  const [coinLoaded, SetAllCoinsLoaded] = useState(false);

  const { bonds } = useBonds();
  const { tokens } = useTokens();
  // console.log('bonds', bonds);
  // console.log('tokens', tokens);

  const address = useSelector(accountSelector);
  const provider = useSelector(providerSelector);
  const isAppLoaded = useSelector(state => state.app && !Boolean(state.app.marketPrice));
  const chainID = useSelector(networkIdSelector);
  const connected = useSelector(connectedSelector);


  const blockChainInit = async (web3, networkId, provider) => {
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
  };

  // Bond and Stake
  async function loadDetails(whichDetails) {
      let loadProvider = provider;

      if (whichDetails === "app" && chainID !== 0) {
          loadApp(loadProvider);
      }

      if (whichDetails === "account" && chainID !== 0 && address && connected) {
          loadAccount(loadProvider);
          if (isAppLoaded) return;

          loadApp(loadProvider);
      }

      if (whichDetails === "userBonds" && chainID !== 0 && address && connected) {
          bonds.map(bond => {
              dispatch(calculateUserBondDetails({ address, bond, provider, networkID: chainID }));
          });
      }

      if (whichDetails === "userTokens" && chainID !== 0 && address && connected) {
          tokens.map(token => {
              dispatch(calculateUserTokenDetails({ address, token, provider, networkID: chainID }));
          });
      }
  }

  const loadApp = useCallback(
      loadProvider => {
          dispatch(loadAppDetails({ networkID: chainID, provider: loadProvider }));
          // bonds.map(bond => {
          //     dispatch(calcBondDetails({ bond, value: null, provider: loadProvider, networkID: chainID }));
          // });
          tokens.map(token => {
              dispatch(calculateUserTokenDetails({ address: "", token, provider, networkID: chainID }));
          });
      },
      [connected],
  );

  const loadAccount = useCallback(
      loadProvider => {
          dispatch(loadAccountDetails({ networkID: chainID, address, provider: loadProvider }));
      },
      [connected],
  );

  const loadTokenCoingeckoPrice = useCallback(async() => {
      await loadTokenPrices();
  });

  useEffect(() => {
      ReactGA.pageview(window.location.pathname + window.location.search);

      console.log('connected', connected);
      if (connected && chainID !== 0) {
          loadDetails("app");
          // loadDetails("account");
          // loadDetails("userBonds");
          // loadDetails("userTokens"); 

          loadTokenCoingeckoPrice();
      }
  }, [connected, chainID]);

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
