import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import {Field} from 'redux-form';
import PropTypes from 'prop-types';
import {useDropzone} from 'react-dropzone';

function FileInput(props) {

    const {className, input: {onChange}, dropzone_options, meta: {error, touched}, label, classNameLabel, children, name, cbFunction} = props;
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        accept: '.gff,.gtf,.gff3',
        onDrop: onChange
    });

    return (
        <section className="container">
            <div {...getRootProps({className: 'dropzone'})}>
                <input {...getInputProps()}/>
                <p>Drag files here, or click to select files</p>
            </div>
        </section>
    );
}

FileInput.propTypes = {
    dropzone_options: PropTypes.object,
    meta: PropTypes.object,
    label: PropTypes.string,
    classNameLabel: PropTypes.string,
    input: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    cbFunction: PropTypes.func,
};

export default props => <Field {...props} component={FileInput}/>;