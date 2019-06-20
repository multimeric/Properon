import {createActions} from 'redux-actions';
import FileReaderStream from 'filereader-stream';
import gff from '@gmod/gff';

export const {setFile, setContigs, setOptions} = createActions({
    SET_FILE: undefined,
    SET_CONTIGS: undefined,
    SET_OPTIONS: undefined
});

export const {uploadFile} = createActions({
    UPLOAD_FILE: payload => {
        return dispatch => {

            // First store the file for later
            dispatch(setFile(payload.gff));

            // Then parse the file to find the contigs
            const contigs = [];
            FileReaderStream(payload.gff)
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

});



