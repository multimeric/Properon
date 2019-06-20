import React from 'react';
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

export default function PlotSettings(props) {
    return (
        <Grid container justify='center' alignItems='center'>
            <form>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="contig">Operon Contig</InputLabel>
                    <Select>
                        {props.contigs.map(contig => {

                            return (
                                <MenuItem value={contig}>
                                    {contig}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="coords">Position Start</InputLabel>
                    <Input name="coordsStart" type="number" id="coordsStart"/>
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="coords">Position End</InputLabel>
                    <Input name="coordsEnd" type="number" id="coordsEnd"/>
                </FormControl>
            </form>
        </Grid>
    );
}
