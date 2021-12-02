import {get} from 'lodash';
import {createSelector} from 'reselect';

const sableCoins = state => get(state, 'stableCoins');
export const stableCoinsSelector = createSelector(sableCoins, sc => sc);