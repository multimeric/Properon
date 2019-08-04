import React, {useContext, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useSelector, useDispatch} from 'react-redux';
import {Field, reduxForm, isValid, getFormValues} from 'redux-form';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

import AnnotationUpload from './AnnotationUpload';
import PlotSettings from './PlotSettings';
import GenePlot from './GenePlot';
import DisplaySettings from './DisplaySettings';
import {Container} from '@material-ui/core';

/**
 * Coordinates the progress through the plot wizard
 */
export default function SinglePageForm(props) {
    const state = useSelector(state => state.data);
    return (
        <Container maxWidth={'lg'}>
            <ExpansionPanel defaultExpanded={true}>
                <ExpansionPanelSummary>
                    <Typography variant={'h5'}>
                        Annotations
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container>
                        <AnnotationUpload loading={state.loadingState.contigs}/>
                        <Divider variant="middle"/>
                        <PlotSettings contigs={state.contigs}/>
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel defaultExpanded={true}>
                <ExpansionPanelSummary>
                    <Typography variant={'h5'}>
                        Plot
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    {state.loadingState.genes && <CircularProgress variant={'indeterminate'}/>}
                    <Grid justify={'center'} container>
                        <GenePlot {...state.settings} start={state.position.start} end={state.position.end}
                                  genes={state.genes}/>
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <DisplaySettings/>
        </Container>
    );
    {/*<Grid*/
    }
    {/*    style={{*/
    }
    {/*        maxWidth: '1000px',*/
    }
    {/*        width: '100%'*/
    }
    {/*    }}*/
    }
    {/*    item>*/
    }
    {/*    <Card style={{*/
    }
    {/*        padding: '13px'*/
    }
    {/*    }}>*/
    }
    {/*        <CardContent>*/
    }
    {/*            
        {/*            
        {/*            
        {/*            <DisplaySettings/>*/
    }
    {/*        </CardContent>*/
    }
    {/*    </Card>*/
    }
    {/*</Grid>*/
    }
}
