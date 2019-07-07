import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as ScriblCanvas from 'scribl';

export default function Scribl(props)  {
    const {tracks, width, ...rest} = props;
    const canvasRef = useRef(null);
    
    const layout = (
        <canvas width={width} ref={canvasRef} {...rest}/>
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        const scribl = new ScriblCanvas.Scribl(canvas, width);
        scribl.glyph.text.color = 'white';
        for (const glyphs of tracks){
            const track = scribl.addTrack();
            for (const glyph of glyphs){
                track.addFeature(glyph);
            }
        }
        scribl.draw();
    });
    
    return layout;
}

Scribl.propTypes = {
    /**
     * An array of tracks. Each track is an array of glyphs to render on that track
     */
    tracks: PropTypes.arrayOf(PropTypes.instanceOf(Scribl.Glyph)),

    /**
     * Width of the diagram
     */
    width: PropTypes.number
};
