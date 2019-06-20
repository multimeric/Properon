import React, {useContext} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import {useSelector, useDispatch} from 'react-redux';

import AnnotationUpload from './AnnotationUpload';
import PlotSettings from './PlotSettings';

import {uploadFile} from '../actions';

/**
 * Coordinates the progress through the plot wizard
 */
export default function OperonStepper(props) {
    // Store access
    const state = useSelector(state => state);
    const dispatch = useDispatch();

    // Local state
    const [activeStep, setActiveStep] = React.useState(0);

    const NextButton = (
        <Button onClick={e => setActiveStep(activeStep + 1)}>
            Next
        </Button>
    );
    const BackButton = (
        <Button onClick={e => setActiveStep(activeStep - 1)}>
            Back
        </Button>
    );

    let stepComponent, backButton, nextButton;
    switch (activeStep) {
        case 0:
            stepComponent = <AnnotationUpload
                value={state.gff}
                onChange={file => dispatch(uploadFile({gff: file}))}
            />;
            nextButton = NextButton;
            backButton = null;
            break;
        case 1:
            stepComponent = <PlotSettings
                contigs={state.contigs}
            />;
            nextButton = NextButton;
            backButton = BackButton;
            break;
        case 2:
            stepComponent = null;
            nextButton = null;
            backButton = BackButton;
            break;
    }

    return (
        <Grid
            style={{
                maxWidth: '600px'
            }}
            item>
            <Card style={{
                padding: '13px'
            }}>
                <CardContent>
                    <Stepper activeStep={activeStep}>
                        <Step key="annotation">
                            <StepLabel>Annotation</StepLabel>
                        </Step>
                        <Step key="settings">
                            <StepLabel>Settings</StepLabel>
                        </Step>
                        <Step key="plot">
                            <StepLabel>Plot</StepLabel>
                        </Step>
                    </Stepper>
                    {stepComponent}
                </CardContent>
                <CardActions>
                    <Grid container justify='space-between' alignItems='center'>
                        <Grid item>
                            {backButton}
                        </Grid>
                        <Grid>
                            {nextButton}
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </Grid>
    );
}
