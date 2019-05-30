import React from 'react';
import './App.css';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {Formik} from 'formik';
import FileReaderStream from 'filereader-stream';
import gff from '@gmod/gff';

function App() {
    return (
        <div className="App">
            <Paper style={{
                width: '500px',
                marginLeft: 'auto',
                marginRight: 'auto',
                flexDirection: 'column',
                display: 'flex',
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
                        console.log(values);
                        let errors = {};
                        return errors;
                    }}
                    onSubmit={(values, {setSubmitting}) => {
                        console.log(values);
                        FileReaderStream(values.file)
                            .pipe(gff.parseStream())
                            .on('data', data => {
                                console.log('got item', data);
                                return data;
                            })
                            .on('end', () => {
                                console.log('done parsing!');
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
                                        setFieldValue("file", event.currentTarget.files[0]);
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
                                <Input name="coordsStart" type="number" id="coordsStart" value={values.coordsStart}
                                       onChange={handleChange}
                                       onBlur={handleBlur}/>
                                {errors.coordsStart && touched.coordsStart && errors.coordsStart}
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="coords">Position End</InputLabel>
                                <Input name="coordsEnd" type="number" id="coordsEnd" value={values.coordsEnd}
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
            </Paper>
        </div>
    );
}

export default App;
