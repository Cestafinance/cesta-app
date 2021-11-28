import './App.css';
import Sidebar from './Components/Commons/Sidebar';
import Topbar from './Components/Commons/Topbar';
import WalletConnect from './Components/WalletConnector';
import Invest from './Components/Invest';

function App() {
    return (
        <div className="App">
            <Sidebar/>
            <Topbar/>
            <WalletConnect/>
            <Invest/>
        </div>
    );
}

export default App;
