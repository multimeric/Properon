import {handleActions} from 'redux-actions';
import * as actions from '../actions';
import GenePlot from '../components/GenePlot';
import DiagramScale from '../components/DiagramScale';

export const initialState = {
    loadingState: {
        contigs: false,
        genes: false
    },
    annotations: null,
    genes: [],
    contigs: [],
    position: {
        contig: null,
        start: 0,
        end: 5000
    },
    settings: {
        scaleFontSize: DiagramScale.defaultProps.fontSize,
        labelFontSize: GenePlot.defaultProps.fontSize,
        scaleHeight: GenePlot.defaultProps.scaleProportion,
        firstLastTick: DiagramScale.defaultProps.endTicks,
        majorTicks: DiagramScale.defaultProps.majorTick,
        minorTicks: DiagramScale.defaultProps.minorTick,
        minorTickHeight: DiagramScale.defaultProps.minorTickHeight,
        majorTickHeight: DiagramScale.defaultProps.majorTickHeight,
        rounded: GenePlot.defaultProps.rounded,
        showScale: GenePlot.defaultProps.showScale,
        centerLine: GenePlot.defaultProps.centerLine,
        width: GenePlot.defaultProps.width,
        height: GenePlot.defaultProps.height,
        pointLength: GenePlot.defaultProps.pointLength
    }
};

export const reducer = handleActions({
    [actions.setContigs]: (state, {payload: contigs}) => {
        return {
            ...state,
            contigs
        };
    },
    [actions.setGenes]: (state, {payload: genes}) => {
        return {
            ...state,
            genes
        };
    },
    [actions.setPosition]: (state, {payload: position}) => {
        return {
            ...state,
            position
        };
    },
    [actions.uploadAnnotations]: (state, {payload: annotations}) => {
        return {
            ...state,
            annotations
        };
    },
    [actions.updateSettings]: (state, {payload: settings}) => {
        return {
            ...state,
            settings
        };
    },
    [actions.setContigLoading]: (state, {payload: loading}) => {
        const ret = {
            ...state,
        };
        ret.loadingState.contigs = loading;
        return ret;
    },
    [actions.setGeneLoading]: (state, {payload: loading}) => {
        const ret = {
            ...state,
        };
        ret.loadingState.genes = loading;
        return ret;
    }
}, initialState);

export default reducer;
