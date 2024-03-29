import React, {useContext, useState} from 'react';
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
import {Field, reduxForm, isValid, getFormValues} from 'redux-form';

import AnnotationUpload from './AnnotationUpload';
import PlotSettings from './PlotSettings';
import Scribl from './Scribl';
import GenePlot from './GenePlot';
import DisplaySettings from './DisplaySettings';

/**
 * Hook that returns true if the form exists and is valid
 */
function useFormValid(form) {
    return useSelector(state => {
            const formValid = isValid(form)(state);
            const formNotEmpty = getFormValues(form)(state) !== undefined;
            return formValid && formNotEmpty;
        }
    );
}

/**
 * Coordinates the progress through the plot wizard
 */
export default function OperonStepper(props) {
    // Store access
    const state = useSelector(state => state);
    const dispatch = useDispatch();

    // Local state
    const [activeStep, setActiveStep] = React.useState(0);
    const settingsValid = useFormValid('plotSettings');
    const [displaySettingsValid, setDisplaySettingsValid] = useState(false);
    const settings = useSelector(getFormValues('plotSettings'));
    const displaySettings = useSelector(getFormValues('displaySettings'));
    const annotationValid = useFormValid('annotations');

    let stepComponent, showNext, showBack, formValid;
    switch (activeStep) {
        case 0:
            stepComponent = <AnnotationUpload/>;
            formValid = annotationValid;
            showNext = true;
            showBack = false;
            break;
        case 1:
            stepComponent = <PlotSettings
                contigs={state.data.contigs}
            />;
            showNext = showBack = true;
            formValid = settingsValid;
            break;
        case 2:
            stepComponent = <DisplaySettings
                onValidityChange={setDisplaySettingsValid}
            />;
            showNext = true;
            showBack = true;
            formValid = displaySettingsValid;
            break;
        case 3:
            stepComponent = (
                <GenePlot
                    // start={settings.coordsStart}
                    // end={settings.coordsEnd}
                    // genes={state.data.lanes}
                    start={settings.coordsStart}
                    end={settings.coordsEnd}
                    rounded={displaySettings.rounded}
                    fontSize={displaySettings.labelFontSize}
                    height={displaySettings.height}
                    width={displaySettings.width}
                    genes={state.data.genes}
                    pointLength={displaySettings.pointLength}
                    showScale={displaySettings.showScale}
                    centerLine={displaySettings.centerLine}
                    scaleProps={{
                        endTicks:displaySettings.firstLastTick,
                        majorTick:displaySettings.majorTicks,
                        minorTick:displaySettings.minorTicks,
                        minorTickHeight: displaySettings.minorTickHeight,
                        majorTickHeight: displaySettings.majorTickHeight,
                        fontSize: displaySettings.labelFontSize,
                        
                    }}
                />
            );
            // stepComponent = <Scribl
            //     width={500}
            //     tracks={state.data.tracks}
            // />;
            showNext = false;
            showBack = true;
            break;
    }

    let nextButton, backButton;
    if (showNext) {
        nextButton = (
            <Button disabled={!formValid} onClick={e => setActiveStep(activeStep + 1)}>
                Next
            </Button>
        );
    }
    else {
        nextButton = null;
    }
    if (showBack) {
        backButton = (
            <Button onClick={e => setActiveStep(activeStep - 1)}>
                Back
            </Button>
        );
    }
    else {
        backButton = null;
    }

    return (
        <Grid
            style={{
                maxWidth: '1000px',
                width: '100%'
            }}
            item>
            <Card style={{
                padding: '13px'
            }}>
                <CardContent>
                    <Stepper activeStep={activeStep}>
                        <Step completed={annotationValid} key="annotation">
                            <StepLabel>Annotation</StepLabel>
                        </Step>
                        <Step completed={settingsValid} key="settings">
                            <StepLabel>Region Settings</StepLabel>
                        </Step>
                        <Step completed={displaySettingsValid} key="displaySettings">
                            <StepLabel>Display Settings</StepLabel>
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
