import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {useDispatch} from 'react-redux';
import {uploadAnnotations} from '../actions';
import {useDropzone} from 'react-dropzone';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function AnnotationUpload(props) {
    const {loading} = props;
    const [filename, setFilename] = useState();
    const dispatch = useDispatch();
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        accept: '.gff,.gtf,.gff3',
        onDrop(files) {
            const file = files[0];
            setFilename(file.name);
            dispatch(uploadAnnotations(file));
        }
    });

    return (
        <Grid container justify='center' alignItems='center'>
            <form>
                <section className="container" style={{textAlign: 'center'}}>
                    <div {...getRootProps({className: 'dropzone'})}>
                        <input {...getInputProps()}/>
                        <Button color={'primary'} variant={'contained'} size={'large'}>
                            Upload GFF
                            {loading ?
                                <CircularProgress variant={'indeterminate'} size={20} color={'secondary'} style={{marginLeft: '5px'}}/>
                                :
                                <CloudUploadIcon style={{marginLeft: '5px'}}/>
                            }
                        </Button>
                    </div>
                    <div>{filename}</div>
                </section>
            </form>
        </Grid>
    );
}

AnnotationUpload.propTypes = {};