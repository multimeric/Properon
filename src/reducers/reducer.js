import {handleActions} from 'redux-actions';
import * as actions from '../actions';

export const initialState = {
    tracks: [],
    contigs: []
};

export const reducer = handleActions({
    [actions.setContigs]: (state, {payload: contigs}) => {
        return {
            ...state,
            contigs: contigs
        };
    },
    [actions.setTracks]: (state, {payload: tracks}) => {
        return {
            ...state,
            tracks: tracks
        };
    },
}, initialState);

export default reducer;

// export default function reducer(state = initialState, action) {
//     switch (action.type) {
//         case 'uploadFile':
//             return {
//                 ...state,
//                 gff: action.gff
//             };
//         case 'setOptions':
//             break;
//         default:
//             return state;
//     }
// }