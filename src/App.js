import React, {createContext, useContext, useReducer} from 'react';
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

import Scribl from './components/Scribl';
import OperonStepper from './components/Stepper';
import SinglePageForm from './components/SinglePage';
import {Provider} from 'react-redux';
import store from './Store';

export default function App() {
    return (
        <Provider store={store}>
            <Grid
                justify={'space-around'}
                alignItems={'center'}
                direction="column"
                container
                spacing={32}
            >
                <SinglePageForm/>
            </Grid>
        </Provider>
    );
}
