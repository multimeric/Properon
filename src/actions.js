import {createActions} from 'redux-actions';
import FileReaderStream from 'filereader-stream';
import gff from '@gmod/gff';
import {getFormValues, isValid} from 'redux-form'
import {Track, BlockArrow} from 'scribl'

export const {setContigs, setTracks} = createActions({
    SET_CONTIGS: undefined,
    SET_TRACKS: undefined
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
            
            const track = [];
            const tracks = [track];
            FileReaderStream(annotations)
                .pipe(gff.parseStream({
                    parseFeatures: true,
                    parseDirectives: false,
                    parseSequences: false
                }))
                .on('data', features => {
                    for (const feature of features){
                        const name = feature.attributes.Name[0];
                        if (feature.type === 'gene' && feature.start <= settings.coordsEnd && feature.end >= settings.coordsStart){
                            track.push(new BlockArrow(
                                name,
                                feature.start,
                                feature.end - feature.start
                            ));
                        }
                    }
                })
                .on('end', () => {
                    dispatch(setTracks(tracks));
                });
        }
    }
});



