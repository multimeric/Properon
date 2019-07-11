import React, {useEffect} from 'react';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import FormControl from '@material-ui/core/FormControl';
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
import TextField from '@material-ui/core/TextField';

import {readGenes} from '../actions';

const renderTextField = ({
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
            placeholder={label}
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
    destroyOnUnmount: false,
    onChange(values, dispatch) {
        dispatch(readGenes());
    }
})(props => {
    const {genes} = props;

    return (
        <Grid container justify='center' alignItems='center'>
            <form>
                <div>
                    <Field placeholder="" label="Add major ticks to the first and last point" name='firstLastTick'
                           component={renderTextField} type="checkbox"/>
                </div>
                <div>
                    <Field label="Scale font size" placeholder="" name='scaleFontSize' component={renderTextField}
                           type="number"/>
                </div>
                <div>
                    <Field label="Label font size" placeholder="" name='labelFontSize' component={renderTextField}
                           type="number"/>
                </div>
                <div>
                    <Field label="Percentage of the plot taken up by the scale" placeholder="" name='scaleHeight'
                           component={renderTextField} type={'number'}/>
                </div>
            </form>
        </Grid>
    );
});

PlotSettings.propTypes = {
    genes: PropTypes.arrayOf(PropTypes.object)
};

export default PlotSettings;
