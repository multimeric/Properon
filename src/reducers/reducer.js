import {handleActions} from 'redux-actions';
import * as actions from '../actions';

export const initialState = {
    tracks: [],
    contigs: [],
    width: 500,
    gff: null,
};

export const reducer = handleActions({
    [actions.setFile]: (state, {payload: gff}) => {
        return {
            ...state,
            gff: gff
        };
    },
    [actions.setContigs]: (state, {payload: contigs}) => {
        return {
            ...state,
            contigs: contigs
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