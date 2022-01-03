import {combineReducers} from 'redux';
import web3 from './web3';
import stableCoins from './stableCoins';

import accountReducer from "../slices/account-slice";
import bondingReducer from "../slices/bond-slice";
import appReducer from "../slices/app-slice";
import pendingTransactionsReducer from "../slices/pending-txns-slice";
import messagesReducer from "../slices/messages-slice";
import wrappingReducer from "../slices/wrap-slice";
import bondTransactionReducer from "../slices/txn-slice";

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
    web3,
    stableCoins,
    account: accountReducer,
    bonding: bondingReducer,
    // app: {
    //     ...app,
    //     appReducer
    // },
    app: appReducer,
    pendingTransactions: pendingTransactionsReducer,
    bondTransaction: bondTransactionReducer,
    messages: messagesReducer,
    wrapping: wrappingReducer,
});

export default rootReduces;