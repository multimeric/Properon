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

export default function AnnotationUpload(props) {
    const [filename, setFilename] = useState('');

    function fileChange(e) {
        const file = e.target.files[0];
        setFilename(file.name);
        props.onChange(file);
    }

    return (
        <Grid container justify='center' alignItems='center'>
            <form>
                <FormControl margin="normal" required fullWidth>
                    <input
                        style={{
                            display: 'none'
                        }}
                        accept=".gff,.gtf,.gff3"
                        multiple
                        type="file"
                        id="file"
                        onChange={fileChange}
                    />
                    <label htmlFor="file">
                        <Button variant='outlined' component="span">
                            Upload GFF
                        </Button>
                    </label>

                    <FormHelperText>{filename}</FormHelperText>
                </FormControl>
            </form>
        </Grid>
    );
}

AnnotationUpload.propTypes = {};