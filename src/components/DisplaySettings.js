import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {Formik, getIn, Field} from 'formik';
import Slider from '@material-ui/core/Slider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import GenePlot from './GenePlot';
import DiagramScale from './DiagramScale';
import {MaterialFormikInput} from './MaterialFormik';
import {updateSettings} from '../actions';
import {useDispatch} from 'react-redux';
import AutoSubmit from './AutoSubmit';

export default function DisplaySettings(props) {
    const dispatch = useDispatch();
    return <Formik
        initialValues={{
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
        }}
        onSubmit={data => {
            dispatch(updateSettings(data));
        }}

    >
        {({handleSubmit, handleChange, handleBlur, values, errors, isValid}) => {
            return <ExpansionPanel>
                <ExpansionPanelSummary>
                    <Typography variant={'h5'}>
                        Advanced Settings
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container justify='center' alignItems='center'>
                        <AutoSubmit debounceMs={300}/>
                        <Grid item md={3}>
                            <Field label="Scale font size" name='scaleFontSize' component={MaterialFormikInput}
                                   type="number"/>
                        </Grid>
                        <Grid item md={3}>
                            <Field label="Label font size" name='labelFontSize' component={MaterialFormikInput}
                                   type="number"/>
                        </Grid>
                        <Grid item md={3}>
                            <Typography gutterBottom>
                                Scale size
                            </Typography>
                            <Field label="Scale size" name='scaleHeight' component={Slider} type={'number'}/>
                        </Grid>
                        <Grid item md={3}>
                            <Field label="Start end tick" name='firstLastTick' component={MaterialFormikInput}
                                   checkbox={true}/>
                        </Grid>
                        <Grid item md={3}>
                            <Field label="Show center line" name='centerLine' component={MaterialFormikInput}
                                   checkbox={true}/>
                        </Grid>
                        <Grid item md={3}>
                            <Field label="Show scale" name='showScale' component={MaterialFormikInput} checkbox={true}/>
                        </Grid>
                        <Grid item md={3}>
                            <Field label="Major ticks" name='majorTicks' component={MaterialFormikInput} type="number"
                                   parse={Number}/>
                        </Grid>
                        <Grid item md={3}>
                            <Field label="Minor ticks" name='minorTicks' component={MaterialFormikInput}
                                   type={'number'}/>
                        </Grid>
                        <Grid item md={3}>
                            <Field label="Round ends" name='rounded' component={MaterialFormikInput} checkbox={true}/>
                        </Grid>
                        <Grid item md={3}>
                            <Field label="Plot width" name='width' component={MaterialFormikInput} type="number"/>
                        </Grid>
                        <Grid item md={3}>
                            <Field label="Plot height" name='height' component={MaterialFormikInput} type="number"/>
                        </Grid>
                        <Grid item md={3}>
                            <Field label="Point length" name='pointLength' component={MaterialFormikInput}
                                   type="number"/>
                        </Grid>
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>;
        }}
    </Formik>;
};
