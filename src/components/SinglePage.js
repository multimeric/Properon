import React, {useContext, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useSelector, useDispatch} from 'react-redux';
import {Field, reduxForm, isValid, getFormValues} from 'redux-form';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

import AnnotationUpload from './AnnotationUpload';
import PlotSettings from './PlotSettings';
import GenePlot from './GenePlot';
import DisplaySettings from './DisplaySettings';
import {Container} from '@material-ui/core';

/**
 * Coordinates the progress through the plot wizard
 */
export default function SinglePageForm(props) {
    const state = useSelector(state => state.data);
    return (
        <>
            <Typography variant={'h3'}>
                Properon
            </Typography>
            <Typography variant={'subtitle1'}>
                Operon Diagram Generator
            </Typography>
            <Container maxWidth={'lg'}>
                <ExpansionPanel defaultExpanded={true}>
                    <ExpansionPanelSummary>
                        <Typography variant={'h5'}>
                            Annotations
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid container>
                            <AnnotationUpload loading={state.loadingState.contigs}/>
                            <Divider variant="middle"/>
                            <PlotSettings contigs={state.contigs}/>
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel defaultExpanded={true}>
                    <ExpansionPanelSummary>
                        <Typography variant={'h5'}>
                            Plot
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid justify={'center'} container>
                            {state.loadingState.genes && <CircularProgress variant={'indeterminate'}/>}
                            <GenePlot
                                geneStrokeWidth={state.settings.geneStrokeWidth}
                                start={state.position.start}
                                end={state.position.end}
                                genes={state.genes}
                                centerLine={state.settings.centerLine}
                                showScale={state.settings.showScale}
                                width={state.settings.width}
                                rounded={state.settings.rounded}
                                geneHeight={state.settings.geneHeight}
                                fontSize={state.settings.labelFontSize}
                                pointLength={state.settings.pointLength}
                                labelRotation={state.settings.labelRotation}
                                scaleProps={{
                                    minorTick: state.settings.minorTicks,
                                    majorTick: state.settings.majorTicks,
                                    color: 'black',
                                    minorTickHeight: state.settings.minorTickHeight,
                                    minorTickWidth: state.settings.minorTickWidth,
                                    majorTickHeight: state.settings.majorTickHeight,
                                    majorTickWidth: state.settings.majorTickWidth,
                                    fontSize: state.settings.scaleFontSize,
                                    lineWidth: state.settings.scaleWidth,
                                    endTicks: state.settings.firstLastTick,
                                    showScale: state.settings.showScale
                                }}
                            />
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <DisplaySettings/>
            </Container>
        </>
    );
}
