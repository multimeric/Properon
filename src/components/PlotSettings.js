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

import {readGenes} from '../actions'

const renderTextField = ({
                             label,
                             input,
                             meta: {touched, invalid, error},
                             ...custom
                         }) => (
    <TextField
        label={label}
        placeholder={label}
        error={touched && invalid}
        helperText={touched && error}
        {...input}
        {...custom}
    />
);

const PlotSettings = reduxForm({
    form: 'plotSettings',
    validate(values) {
        const errors = {};

        if (!values.contig)
            errors.contig = 'required';

        if (!values.coordsStart)
            errors.coordsStart = 'required';

        if (!values.coordsEnd)
            errors.coordsEnd = 'required';
        else if (values.coordsEnd <= values.coordsStart)
            errors.coordsEnd = 'Can\'t be lower than the start coordinate';

        return errors;
    },
    destroyOnUnmount: false,
    onChange(values, dispatch){
        dispatch(readGenes());
    }
})(props => {
    const {contigs, initialize, pristine} = props;

    // Set the default contig to be the first one
    useEffect(() => {
        if (pristine) {
            initialize({
                contig: contigs[0]
            });
        }
    }, [contigs]);

    return (
        <Grid container justify='center' alignItems='center'>
            <form>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="contig">Operon Contig</InputLabel>
                    <Field name='contig' component={
                        ({input, meta}) => {
                            return <Select value={input.value} onChange={input.onChange}>
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
                <div>
                    <Field label="Start coordinate" name='coordsStart' component={renderTextField} type={'number'} parse={Number}/>
                </div>
                <div>
                    <Field label="End coordinate" name='coordsEnd' component={renderTextField} type={'number'} parse={Number}/>
                </div>
            </form>
        </Grid>
    );
});

PlotSettings.propTypes = {
    selectedContig: PropTypes.string,
    selectContig: PropTypes.func,
    contigs: PropTypes.arrayOf(PropTypes.string)
};

export default PlotSettings;
