import React from 'react';
import './App.css';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {Formik} from 'formik';

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
                    initialValues={{email: '', password: ''}}
                    validate={values => {
                        let errors = {};
                        if (!values.email) {
                            errors.email = 'Required';
                        }
                        else if (
                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                        ) {
                            errors.email = 'Invalid email address';
                        }
                        return errors;
                    }}
                    onSubmit={(values, {setSubmitting}) => {
                        setTimeout(() => {
                            alert(JSON.stringify(values, null, 2));
                            setSubmitting(false);
                        }, 400);
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
                          /* and other goodies */
                      }) => (
                        <form>
                            <FormControl margin="normal" required fullWidth>
                                <input
                                    style={{
                                        display: 'none'
                                    }}
                                    accept="image/*"
                                    id="file"
                                    multiple
                                    type="file"
                                />
                                <label htmlFor="file">
                                    <Button raised component="span">
                                        Upload
                                    </Button>
                                </label>
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="contig">Operon Contig</InputLabel>
                                <Input name="contig" type="text" id="contig"/>
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="coords">Position Start</InputLabel>
                                <Input name="coordsStart" type="number" id="coordsStart"/>
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="coords">Position End</InputLabel>
                                <Input name="coordsEnd" type="number" id="coordsEnd"/>
                            </FormControl>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                            >
                                Plot
                            </Button>
                        </form>
                    ) }
                </Formik>
            </Paper>
        </div>
    );
}

export default App;
