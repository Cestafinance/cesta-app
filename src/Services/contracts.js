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

export const getTotalTvlForStrategies = () => {
    return axios.get(`/v1/contracts/strategies/tvl/total`);
}

export const getAllStrategiesInfo = (network) => {
    return axios.get(`/v1/contracts/strategies/list/info`,{
        params: {
            network
        }
    });
}

export const getStrategyChartData = (strategyId, days) =>  {
    return axios.get(`/v1/contracts/strategies/chart/${days}`,{
        params: {
            id: strategyId
        }
    });
}

export const getStrategyCoinDistribution = (id) => {
    return axios.get(`/v1/contracts/strategies/distribution?id=${id}`);
}