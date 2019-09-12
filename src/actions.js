import {createActions} from 'redux-actions';
import FileReaderStream from 'filereader-stream';
import gff from '@gmod/gff';
import {getFormValues, isValid} from 'redux-form';
import {Lava} from './colours';

import get from 'lodash/get';


const geneColours = new Lava();

export const {setContigs, setGenes, updateSettings, setContigLoading, setGeneLoading} = createActions({
    SET_CONTIGS: undefined,
    SET_GENES: undefined,
    UPDATE_SETTINGS: undefined,
    SET_CONTIG_LOADING: undefined,
    SET_GENE_LOADING: undefined
});

export const {uploadAnnotations, setPosition} = createActions({
    UPLOAD_ANNOTATIONS: [
        annotations => {
            // Upload an annotations file.
            // The reducer will set the actual annotation state. This creator also reads the annotations to find the contigs
            return (dispatch, getState) => {
                // First, tell the application we're loading
                dispatch(setContigLoading(true));
                
                // Then parse the file to find the contigs
                const contigs = [];
                FileReaderStream(annotations)
                    .pipe(gff.parseStream({
                        parseFeatures: false,
                        parseDirectives: true,
                        parseSequences: false
                    }))
                    .on('data', directive => {
                        if (directive.directive === 'sequence-region')
                            contigs.push(directive.seq_id);
                    })
                    .on('end', () => {
                        // Finally, update the contigs, and set the loading state
                        // This could be one action, but theoretically we might want to do one without the other
                        dispatch(setContigLoading(false));
                        dispatch(setContigs(contigs));
                    });
            };
        },
        payload => ({preThunkPayload: payload})
    ],
    SET_POSITION: [
        position => {
            // Set the position of interest. This action creator will parse the GFF to find genes, and the reducer will
            // set the position state the store.
            return (dispatch, getState) => {

                // Stop if we have no annotations to plot
                const {annotations} = getState().data;
                if (annotations === null)
                    return;
                
                // First, tell the application we're loading
                dispatch(setGeneLoading(true));

                const genes = [];
                FileReaderStream(annotations)
                    .pipe(gff.parseStream({
                        parseFeatures: true,
                        parseDirectives: false,
                        parseSequences: false
                    }))
                    .on('data', features => {
                        for (const feature of features) {
                            // Fetch the name, or default to an empty string
                            const name =  get(feature, 'attributes.Name[0]', '');

                            // Skip features without the required attributes
                            if (!['type', 'start', 'end'].every(k => k in feature))
                                continue;

                            if (
                                feature.type === 'gene'
                                && feature.start <= position.end
                                && feature.end <= position.end
                                && feature.start >= position.start
                                && feature.end >= position.start
                            ) {
                                genes.push({
                                    start: feature.start,
                                    end: feature.end,
                                    text: name,
                                    strand: feature.strand,
                                    color: geneColours.getColour()
                                });
                            }
                        }
                    })
                    .on('end', () => {
                        dispatch(setGeneLoading(false));
                        dispatch(setGenes(genes));
                    });
            };
        },
        payload => ({preThunkPayload: payload})
    ]
});



