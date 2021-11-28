export const getConnectionStatus = () => {
    let status = localStorage.getItem('connection')

    try {
        if(status) {
            status = JSON.parse(status)
        }
        return status;
    } catch (Err) {
        return {
            source: 'metamask',
            connected: true
        }
    }
}

export const setConnectionStatus = (value) => {
    return localStorage.setItem('connection', value);
}