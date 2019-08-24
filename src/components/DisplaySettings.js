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
            pointLength: GenePlot.defaultProps.pointLength,
            scaleWidth: DiagramScale.defaultProps.lineWidth,
            minorTickWidth: DiagramScale.defaultProps.minorTickWidth,
            majorTickWidth: DiagramScale.defaultProps.majorTickWidth,
            geneStrokeWidth: GenePlot.defaultProps.geneStrokeWidth,
            geneHeight: GenePlot.defaultProps.geneHeight,
            labelRotation: GenePlot.defaultProps.labelRotation
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
                    <AutoSubmit debounceMs={300}/>
                    <Grid container direction={'row'} justify={'space-evenly'}>
                        <Grid md={4} item>
                            <Typography variant={'h6'}>Scale Settings</Typography>
                            <Grid container justify='center' alignItems='stretch' direction={'column'}>
                                <Grid item>
                                    <Field fullWidth label="Show scale" name='showScale' component={MaterialFormikInput}
                                           checkbox={true}/>
                                </Grid>
                                <Grid item>
                                    <Field label="Scale font size" name='scaleFontSize' component={MaterialFormikInput}
                                           type="number"/>
                                </Grid>
                                <Grid item>
                                    <Field label="Minor tick interval" name='minorTicks' component={MaterialFormikInput}
                                           type={'number'}/>
                                </Grid>
                                <Grid item>
                                    <Field label="Minor tick height" name='minorTickHeight'
                                           component={MaterialFormikInput}
                                           type="number"/>
                                </Grid>
                                <Grid item>
                                    <Field label="Minor tick width" name='minorTickWidth'
                                           component={MaterialFormikInput}
                                           type="number"/>
                                </Grid>
                                <Grid item>
                                    <Field label="Major tick interval" name='majorTicks' component={MaterialFormikInput}
                                           type="number"
                                           parse={Number}/>
                                </Grid>
                                <Grid item>
                                    <Field label="Major tick width" name='majorTickWidth'
                                           component={MaterialFormikInput}
                                           type="number"/>
                                </Grid>
                                <Grid item>
                                    <Field label="Major tick height" name='majorTickHeight'
                                           component={MaterialFormikInput}
                                           type="number"/>
                                </Grid>
                                <Grid item>
                                    <Field label="Scale width" name='scaleWidth' component={MaterialFormikInput}
                                           type="number"/>
                                </Grid>
                                <Grid item>
                                    <Field label="Start end tick" name='firstLastTick' component={MaterialFormikInput}
                                           checkbox={true}/>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid md={4} item>
                            <Typography variant={'h6'}>Gene Settings</Typography>
                            <Grid container justify='center' alignItems='stretch' direction={'column'}>
                                <Grid item>
                                    <Field label="Gene symbol height" name='geneHeight'
                                           component={MaterialFormikInput}
                                           type="number"/>
                                </Grid>
                                <Grid item>
                                    <Field label="Gene label font size" name='labelFontSize'
                                           component={MaterialFormikInput}
                                           type="number"/>
                                </Grid>
                                <Grid item>
                                    <Field label="Gene border width" name='geneStrokeWidth'
                                           component={MaterialFormikInput}
                                           type="number"/>
                                </Grid>
                                <Grid item>
                                    <Field label="Round ends" name='rounded' component={MaterialFormikInput}
                                           checkbox={true}/>
                                </Grid>
                                <Grid item>
                                    <Field label="Gene taper length" name='pointLength' component={MaterialFormikInput}
                                           type="number"/>
                                </Grid>
                                <Grid item>
                                    <Field label="Label rotation" name='labelRotation' component={MaterialFormikInput}
                                           type="number" inputProps={{min: 0, max: 90}}/>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid md={4} item>
                            <Typography variant={'h6'}>Miscellaneous Settings</Typography>
                            <Grid container justify='center' alignItems='stretch' direction={'column'}>
                                <Grid item>
                                    <Field label="Show center line" name='centerLine' component={MaterialFormikInput}
                                           checkbox={true}/>
                                </Grid>
                                <Grid item>
                                    <Field label="Plot width" name='width' component={MaterialFormikInput}
                                           type="number"/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>;
        }}
    </Formik>
};
