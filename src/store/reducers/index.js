import {combineReducers} from 'redux';
import web3 from './web3';
import stableCoins from './stableCoins';

function app(state={
    theme: 'dark'
}, action) {

    switch (action.type) {
        case 'THEME_UPDATED':
            return {
                ...state,
                theme: action.theme
            }
        default:
            return state;
    }

}

const rootReduces = combineReducers({
    app,
    web3,
    stableCoins
});

export default rootReduces;