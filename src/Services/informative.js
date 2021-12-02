import axios from "./axios";

export const getStrategyLineGraphData = (id, days) => {
    return axios.get(`/vaults/performance-apy/${id}/${days}`, {
    });
}

export const getStrategyCoinsDistribution = (id) => {
    return axios.get(`/vaults/${id}/distribution`, {
    });
}

export const getPNLInfo = (id) => {
    return axios.get(`/vaults/pnl/${id}`);
}

export const getTvlByNetwork = (network) => {
    return axios.get(`/vaults/${network}/all`);
}