import {getIn} from 'formik';
import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';

export function MaterialFormikInput(
    {
        field,
        form,
        checkbox = false,
        label,
        ...custom
    }) {
    const error = getIn(form.errors, field.name);
    const touched = getIn(form.touched, field.name);

    if (checkbox) {
        return (<FormControlLabel
            control={
                <Checkbox
                    {...field}
                    {...custom}
                    checked={field.value}
                    color="primary"
                />
            }
            label={label}
        />);
    }
    else {
        return (<TextField
            label={label}
            error={touched && error}
            helperText={touched && error}
            {...field}
            {...custom}
        />);
    }
}

