import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "https://test.daoventures.co/api/";

export default axios;