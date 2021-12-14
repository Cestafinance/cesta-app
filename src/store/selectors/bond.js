import {get} from 'lodash';
import {createSelector} from "reselect";


const bonding = state => get(state, 'bonding');
export const bondingSelector = createSelector(bonding, b => b.loading ? b.loading : true);