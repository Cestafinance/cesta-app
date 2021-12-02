import axios from './axios';

export const getAllStableCoinsContract = (network) => {
    return axios.get(`/v1/contracts/stable/coins`, {
        params: {
            network
        }
    });
}


export const getAllStrategies = (network) => {
    return axios.get(`/v1/contracts/strategies/list`, {
        params: {
            network
        }
    });
}
