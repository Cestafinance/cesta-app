import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "https://app.cesta.finance/api/";

export default axios;