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
import PropTypes from 'prop-types';
import {Formik, withFormik, Field} from 'formik';
import TextField from '@material-ui/core/TextField';
import {useSelector, useDispatch} from 'react-redux';

import {MaterialFormikInput} from './MaterialFormik';
import {setPosition} from '../actions';
import AutoSubmit from './AutoSubmit';

export default function PlotSettings(props) {
    const dispatch = useDispatch();
    return <Formik
        initialValues={{
            contig: '',
            start: 0,
            end: 5000
        }}
        onSubmit={values => {
            console.log(values);
            dispatch(setPosition(values));
        }}
        render={formikProps => <_InnerForm {...props} {...formikProps}/>}
    />;
}

function _InnerForm(props) {
    const {contigs, handleSubmit, handleChange, handleBlur, values, errors, setFieldValue} = props;

    // Whenever the list of contigs changes, set the current value to the first one
    useEffect(() => {
        setFieldValue('contig', contigs[0]);
    }, [contigs]);

    return (
        <Grid container justify='center' alignItems='center'>
            <AutoSubmit debounceMs={300}/>
            <Grid item md={4}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="contig">Operon Contig</InputLabel>
                    <Field name='contig' component={
                        ({field}) => {
                            return <Select {...field}>
                                {
                                    contigs.map(contig => {

                                        return (
                                            <MenuItem value={contig}>
                                                {contig}
                                            </MenuItem>
                                        );
                                    })
                                }
                            </Select>;
                        }
                    }/>
                </FormControl>
            </Grid>
            <Grid item md={4}>
                <Field label="Start coordinate" name='start' fullWidth component={MaterialFormikInput} type={'number'}/>
            </Grid>
            <Grid item md={4}>
                <Field label="End coordinate" name='end' fullWidth component={MaterialFormikInput} type={'number'}/>
            </Grid>
        </Grid>
    );
}

PlotSettings.propTypes = {
    selectedContig: PropTypes.string,
    selectContig: PropTypes.func,
    contigs: PropTypes.arrayOf(PropTypes.string)
};
