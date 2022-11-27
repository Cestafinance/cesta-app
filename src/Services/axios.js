import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "http://3.219.168.23:8080";

export default axios;