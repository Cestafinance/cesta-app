import {
    Suspense,
    Fragment, lazy
} from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Redirect
} from "react-router-dom";
import Sidebar from './Components/Commons/Sidebar';
import Topbar from './Components/Commons/Topbar';
import WalletConnect from './Components/WalletConnector';
import './App.css';


const Invest = lazy(() => import('./Components/Invest'));
const Bond = lazy(() => import('./Components/Bond'));
const Stake = lazy(() => import('./Components/Stake'));

function App() {
    return (
        <div className="App">
            <Suspense fallback={<div>Loading...</div>}>
                <Router>
                    <Sidebar/>
                    <Topbar/>
                    <WalletConnect/>
                    <Routes>
                        <Route
                            exact
                            path={'/invest'}
                            element={<Invest/>}
                        />
                        <Route
                            exact
                            path={'/bond'}
                            element={<Bond/>}
                        />
                        <Route
                            exact
                            path={'/stake'}
                            element={<Stake/>}
                        />

                    </Routes>
                </Router>
            </Suspense>

        </div>
    );
}

export default App;
