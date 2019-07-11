import {createActions} from 'redux-actions';
import FileReaderStream from 'filereader-stream';
import gff from '@gmod/gff';
import {getFormValues, isValid} from 'redux-form';
import {Lava} from './colours';

const geneColours = new Lava();

export const {setContigs, setGenes} = createActions({
    SET_CONTIGS: undefined,
    SET_GENES: undefined
});

export const {readContigs, readGenes} = createActions({
    READ_CONTIGS: payload => {
        return (dispatch, getState) => {
            const form = getFormValues('annotations')(getState());

            // Then parse the file to find the contigs
            const contigs = [];
            FileReaderStream(form.annotations[0])
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
                    dispatch(setContigs(contigs));
                });
        };
    },
    READ_GENES: payload => {
        return (dispatch, getState) => {
            const state = getState();
            const settingsValid = isValid('plotSettings')(state);
            const annotations = getFormValues('annotations')(state).annotations[0];
            const settings = getFormValues('plotSettings')(state);

            if (!settingsValid)
                return;

            const genes = [];
            FileReaderStream(annotations)
                .pipe(gff.parseStream({
                    parseFeatures: true,
                    parseDirectives: false,
                    parseSequences: false
                }))
                .on('data', features => {
                    for (const feature of features) {
                        const name = feature.attributes.Name[0];
                        if (
                            feature.type === 'gene'
                            && feature.start <= settings.coordsEnd
                            && feature.end <= settings.coordsEnd
                            && feature.start >= settings.coordsStart
                            && feature.end >= settings.coordsStart
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
                    dispatch(setGenes(genes));
                });
        };
    }
});



