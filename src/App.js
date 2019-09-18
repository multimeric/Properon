import React from 'react';
import './App.css';
import Grid from '@material-ui/core/Grid';
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
