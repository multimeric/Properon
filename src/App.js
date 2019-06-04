import React from 'react';
import './App.css';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {Formik} from 'formik';
import FileReaderStream from 'filereader-stream';
import gff from '@gmod/gff';
import * as ScriblCanvas from 'scribl';

import Scribl from './Scribl';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tracks: [],
            width: 500
        };
    }
    
    static pickContig(){
        
    }

    render() {
        return (
            <Grid
                justify={'space-around'}
                alignItems={'center'}
                direction="column"
                container
                spacing={32}
            >
                <Grid
                    style={{
                        maxWidth: '600px'
                    }}
                    item>

                    {/*<Grid style={{*/}
                    {/*    maxWidth: '500px'*/}
                    {/*}} container spacing={'20px'} direction={'column'} justify={'center'} alignItems={'center'}*/}
                    {/*>*/}
                    <Card style={{
                        padding: '33px'
                    }}>
                        <Typography component="h1" variant="h5">
                            Upload Annotation
                        </Typography>
                        <Formik
                            initialValues={{
                                file: undefined,
                                contig: '',
                                coordsStart: 2,
                                coordsEnd: 1
                            }}
                            validate={values => {
                                let errors = {};
                                if (!values.file)
                                    errors.file = 'Required';
                                if (!values.contig)
                                    errors.contig = 'Required';
                                if (!values.coordsStart)
                                    errors.coordsStart = 'Required';
                                if (!values.coordsEnd)
                                    errors.coordsEnd = 'Required';
                                if (values.coordsStart >= values.coordsEnd)
                                    errors.coords = 'End coordinate must be higher than the start coordinate';
                                return errors;
                            }}
                            onSubmit={(values, {setSubmitting}) => {
                                const genes = [];
                                FileReaderStream(values.file)
                                    .pipe(gff.parseStream())
                                    .on('data', features => {
                                        for (const feature of features) {
                                            if (feature.type === 'gene'
                                                && feature.seq_id === values.contig
                                                && feature.start >= values.coordsStart
                                                && feature.end <= values.coordsEnd
                                            ) {
                                                genes.push(
                                                    new ScriblCanvas.BlockArrow('gene', feature.start, feature.end - feature.start + 1, feature.strand)
                                                );
                                            }
                                        }
                                    })
                                    .on('end', () => {
                                        this.setState({
                                            tracks: [genes]
                                        });
                                        setSubmitting(false);
                                    });

                            }}
                        >
                            {({
                                  values,
                                  errors,
                                  touched,
                                  handleChange,
                                  handleBlur,
                                  handleSubmit,
                                  isSubmitting,
                                  setFieldValue
                                  /* and other goodies */
                              }) => (
                                <form onSubmit={handleSubmit}>
                                    <FormControl margin="normal" required fullWidth>
                                        <input
                                            style={{
                                                display: 'none'
                                            }}
                                            accept="image/*"
                                            id="file"
                                            multiple
                                            type="file"
                                            // value={values.file}
                                            onBlur={handleBlur}
                                            onChange={(event) => {
                                                setFieldValue('file', event.currentTarget.files[0]);
                                            }}
                                        />
                                        {errors.file && touched.file && errors.file}
                                        <label htmlFor="file">
                                            <Button variant='outlined' component="span">
                                                Upload GFF
                                            </Button>
                                        </label>
                                    </FormControl>
                                    <FormControl margin="normal" required fullWidth>
                                        <InputLabel htmlFor="contig">Operon Contig</InputLabel>
                                        <Input name="contig" type="text" id="contig" value={values.contig}
                                               onChange={handleChange}
                                               onBlur={handleBlur}/>
                                        {errors.contig && touched.contig && errors.contig}
                                    </FormControl>
                                    <FormControl margin="normal" required fullWidth>
                                        <InputLabel htmlFor="coords">Position Start</InputLabel>
                                        <Input name="coordsStart" type="number" id="coordsStart"
                                               value={values.coordsStart}
                                               onChange={handleChange}
                                               onBlur={handleBlur}/>
                                        {errors.coordsStart && touched.coordsStart && errors.coordsStart}
                                    </FormControl>
                                    <FormControl margin="normal" required fullWidth>
                                        <InputLabel htmlFor="coords">Position End</InputLabel>
                                        <Input name="coordsEnd" type="number" id="coordsEnd"
                                               value={values.coordsEnd}
                                               onChange={handleChange}
                                               onBlur={handleBlur}/>
                                        {errors.coordsEnd && touched.coordsEnd && errors.coordsEnd}
                                    </FormControl>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        disabled={isSubmitting}
                                    >
                                        Plot
                                    </Button>
                                </form>
                            )}
                        </Formik>
                    </Card>
                </Grid>
                <Grid
                    style={{
                        maxWidth: '600px'
                    }}
                    item>
                    <Card style={{
                        padding: '33px'
                    }}>
                        <Scribl tracks={this.state.tracks} width={this.state.width}/>
                    </Card>
                </Grid>

                {/*</Grid>*/}
                {/*</Grid>*/}
            </Grid>
        );
    }
}

export default App;
