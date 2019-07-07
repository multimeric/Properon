import React, {useContext, useState} from 'react';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import PropTypes from 'prop-types';
import {reduxForm, getFormValues} from 'redux-form';
import {useSelector} from 'react-redux';

import {readContigs} from '../actions';

import FileInput from './InputFile';

const AnnotationUpload = reduxForm({
    form: 'annotations',
    destroyOnUnmount: false,
    onChange(values, dispatch, props, previous) {
        dispatch(readContigs());
    }
})(props => {
    const currentState = useSelector(getFormValues(props.form));
    let label = null;
    if (currentState) {
        const gff = currentState.annotations[0];
        label = (
            <div>
                {gff.name}
            </div>
        );
    }

    return (
        <Grid container justify='center' alignItems='center'>
            <form>
                <FileInput
                    name="annotations"
                    dropzone_options={{
                        multiple: false,
                        accept: 'image/*'
                    }}
                />
                {label}
            </form>
        </Grid>
    );
});

export default AnnotationUpload;

AnnotationUpload.propTypes = {};