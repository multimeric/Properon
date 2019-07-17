import {handleActions} from 'redux-actions';
import * as actions from '../actions';
import GenePlot from '../components/GenePlot';
import DiagramScale from '../components/DiagramScale';

export const initialState = {
    genes: [],
    contigs: [],
    position: {
        contig: null,
        start: 0,
        end: 2000
    },
    settingsForm: {
        scaleFontSize: DiagramScale.defaultProps.fontSize,
        labelFontSize: GenePlot.defaultProps.fontSize,
        scaleHeight: GenePlot.defaultProps.scaleProportion,
        firstLastTick: DiagramScale.defaultProps.endTicks,
        majorTicks: DiagramScale.defaultProps.majorTick,
        minorTicks: DiagramScale.defaultProps.minorTick,
        rounded: GenePlot.defaultProps.rounded,
        width: GenePlot.defaultProps.width,
        height: GenePlot.defaultProps.height,
        pointLength: GenePlot.defaultProps.pointLength
    }
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
    [actions.updatePosition]: (state, payload) => {
        return {
            ...state,
            position: payload
        }
    }
}, initialState);

export default reducer;
