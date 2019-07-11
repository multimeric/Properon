import {handleActions} from 'redux-actions';
import * as actions from '../actions';

export const initialState = {
    genes: [],
    contigs: []
};

export const reducer = handleActions({
    [actions.setContigs]: (state, {payload: contigs}) => {
        return {
            ...state,
            contigs: contigs
        };
    },
    [actions.setGenes]: (state, {payload: genes}) => {
        return {
            ...state,
            genes: genes
        };
    },
}, initialState);

export default reducer;
