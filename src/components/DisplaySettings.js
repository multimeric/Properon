import React, {useEffect} from 'react';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import {MenuItem, Select} from '@material-ui/core';
import {Field, reduxForm, isValid} from 'redux-form';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {Formik} from 'formik';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';

import GenePlot from './GenePlot';
import DiagramScale from './DiagramScale';
import {readGenes} from '../actions';

const renderCheckBox = (
    {
        label,
        input,
        meta: {touched, invalid, error},
        ...custom
    }) => {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    {...input}
                    {...custom}
                    checked={input.value}
                    value="checkedB"
                    color="primary"
                />
            }
            label={label}
        />
    );
};

const renderTextField = (
    {
        label,
        placeholder = null,
        input,
        meta: {touched, invalid, error},
        ...custom
    }) => {
    if (placeholder === null) {
        placeholder = label;
    }

    return (
        <TextField
            label={label}
            placeholder={placeholder}
            error={touched && invalid}
            helperText={touched && error}
            {...input}
            {...custom}
        />
    );
};

const PlotSettings = reduxForm({
    form: 'displaySettings',
    validate(values) {
        const errors = {};
        return errors;
    },
    // Take most of these defaults from the prop defaults
    initialValues: {
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
    },
    destroyOnUnmount: false,
    onChange(values, dispatch) {
        dispatch(readGenes());
    }
})(props => {
    const {genes} = props;

    return (
        <Grid container justify='center' alignItems='center'>
            <Grid item md={3}>
                <Field label="Scale font size" name='scaleFontSize' component={renderTextField} type="number"
                       parse={Number}/>
            </Grid>
            <Grid item md={3}>
                <Field label="Label font size" name='labelFontSize' component={renderTextField} type="number"
                       parse={Number}/>
            </Grid>
            <Grid item md={3}>
                <Typography gutterBottom>
                    Scale size
                </Typography>
                <Field label="Scale size" name='scaleHeight' component={Slider} type={'number'} parse={Number}/>
            </Grid>
            <Grid item md={3}>
                <Field label="Start end tick" name='firstLastTick' component={renderCheckBox}/>
            </Grid>
            <Grid item md={3}>
                <Field label="Major ticks" name='majorTicks' component={renderTextField} type="number" parse={Number}/>
            </Grid>
            <Grid item md={3}>
                <Field label="Minor ticks" name='minorTicks' component={renderTextField} type={'number'}
                       parse={Number}/>
            </Grid>
            <Grid item md={3}>
                <Field label="Round ends" name='rounded' component={renderCheckBox}/>
            </Grid>
            <Grid item md={3}>
                <Field label="Plot width" name='width' component={renderTextField} type="number" parse={Number}/>
            </Grid>
            <Grid item md={3}>
                <Field label="Plot height" name='height' component={renderTextField} type="number" parse={Number}/>
            </Grid>
            <Grid item md={3}>
                <Field label="Point length" name='pointLength' component={renderTextField} type="number"
                       parse={Number}/>
            </Grid>
        </Grid>
    );
});

PlotSettings.propTypes = {
    genes: PropTypes.arrayOf(PropTypes.object)
};

export default PlotSettings;
