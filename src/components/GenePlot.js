import React, {useRef, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import FileSaver from 'file-saver';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {flexbox} from '@material-ui/system';

import SvgLayout from './SvgLayout';
import ResizingSvg from './ResizingSvg';
import DiagramScale from './DiagramScale';
import GeneBlocks from './GeneBlocks';

export default function GenePlot(props) {
    const {
        start,
        end,
        width,
        padding,
        pointLength,
        geneHeight,
        genes,
        scaleProps,
        rounded,
        fontSize,
        centerLine,
        showScale,

    } = props;

    // Keep track of the SVG element, so we can export it
    const svgRef = useRef();

    // How long is the area we can actually draw in, in SVG units
    const displayLength = width - (2 * padding);

    // The amount of genomic units we need to fit into the SVG
    const valueLength = end - start;

    // Width, measured in "svg units per genomic unit"
    const widthScale = displayLength / valueLength;

    // The height of each tick, in SVG units
    const MAJOR_TICK = 0.05;
    const MINOR_TICK = 0.02;

    const TEXT_COLOR = 'black';

    // const viewBox = `0 0 ${width} ${height}`;
    return (
        <Grid direction={'row'} container justify={'center'}>
            <Grid direction={'row'} xs={12} justify={'center'} container>
                <div style={{overflowX: 'auto'}}>
                    <ResizingSvg ref={svgRef} style={{
                        width: width
                    }}>
                        <SvgLayout mode="height">
                            {showScale && <DiagramScale
                                xOffsetStart={padding}
                                xOffsetEnd={padding + displayLength}
                                valueStart={start}
                                valueEnd={end}
                                majorTickHeight={MAJOR_TICK}
                                minorTickHeight={MINOR_TICK}
                                // majorTickWidth={0.2}
                                // minorTickWidth={0.05}
                                {...scaleProps}
                            />}
                            <GeneBlocks
                                xOffsetStart={padding}
                                xOffsetEnd={padding + displayLength}
                                pointLength={pointLength}
                                fontSize={fontSize}
                                geneHeight={geneHeight}
                                genes={genes}
                                rounded={rounded}
                                start={start}
                                end={end}
                                textColour={TEXT_COLOR}
                                widthScale={widthScale}
                                xPadding={padding}
                                centerLine={centerLine}
                            />
                        </SvgLayout>
                    </ResizingSvg>
                </div>
            </Grid>
            <Grid direction={'row'} xs={12} justify={'center'} item>
                <Button size={'large'} color={'primary'} variant={'contained'} onClick={e => {
                    const data = svgRef.current.outerHTML;
                    const blob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
                    FileSaver.saveAs(blob, 'gene.svg');
                }}>
                    Download
                </Button>
            </Grid>
        </Grid>
    );
}

GenePlot.propTypes = {
    /**
     * Where to start the plot, in genomic coordinates
     */
    start: PropTypes.number,

    /**
     * Where to end the plot, in genomic coordinates
     */
    end: PropTypes.number,

    /**
     * A dictionary of props to pass into the <DiagramScale/>
     */
    scaleProps: PropTypes.object,

    /**
     * Font size for the gene labels
     */
    fontSize: PropTypes.number,

    /**
     * Array of genes to plot
     * Each gene has {start, end, color, text}
     */
    genes: PropTypes.array,

    /**
     * Width of the entire plot, in HTML units
     */
    width: PropTypes.number,

    /**
     * Height of the entire plot, in HTML units
     */
    height: PropTypes.number,

    /**
     * The amount of space to leave either side of the scale, but still inside the SVG, as a proportion of the width.
     * This should be a number between 0 and 1
     */
    padding: PropTypes.number,

    /**
     * How early to start curving the gene polygons in to a point, as a proportion of width. Must be between 0 and 1
     */
    pointLength: PropTypes.number,

    /**
     * The proportion of the whole component devoted to the scale, must be a number between 0 and 1
     */
    scaleProportion: PropTypes.number,

    /**
     * Whether or not to round the ends of the gene polygons
     */
    rounded: PropTypes.bool,

    geneHeight: PropTypes.number,

    /**
     * Whether to have a central line going through the middle of each gene
     */
    centerLine: PropTypes.bool,

    /**
     * Whether or not to show the scale
     */
    showScale: PropTypes.bool
};

GenePlot.defaultProps = {
    geneHeight: 200,
    scaleProps: {},
    fontSize: 20,
    width: 800,
    // height: 15,
    padding: 50,
    pointLength: 500,
    scaleProportion: 0.3,
    rounded: false,
    centerLine: true,
    showScale: true
};