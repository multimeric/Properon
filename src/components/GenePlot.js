import React, {useRef, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Path from 'svg-path-generator';
import FileSaver from 'file-saver';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Fraction from 'fraction.js';

import SvgLayout from './SvgLayout';
import ResizingSvg from './ResizingSvg';
import DiagramScale from './DiagramScale';

export default function GenePlot(props) {
    const {start, end, width, padding, pointLength, geneHeight, genes, scaleProps, rounded, fontSize} = props;

    // Keep track of the SVG element, so we can export it
    const svgRef = useRef();

    // Number we subtract from the start and end of the SVG as padding, in SVG units
    const X_PADDING = padding * width;

    // How long is the area we can actually draw in, in SVG units
    const displayLength = width - (2 * X_PADDING);

    // The amount of genomic units we need to fit into the SVG
    const valueLength = end - start;

    // Width, measured in "svg units per genomic unit"
    const widthScale = Fraction(displayLength).div(valueLength);

    // The height of each tick, in SVG units
    const MAJOR_TICK = 0.05;
    const MINOR_TICK = 0.02;

    const TEXT_COLOR = 'black';

    function Genes(props) {
        const {yOffset, reportHeight} = props;
        return genes.map(gene => {
            const geneLength = gene.end - gene.start;

            /*
            The relevant points for a gene are these:
            a------b-c
            |----m---d
            g------f-e
            
            For a square gene, we draw lines from a -> b -> d -> f -> g, which forms a rectangle with a point
            If this gene is rounded, we use c and e as bezier control points
            For a gene that's too short to have the rectangle section, we form a triangle with a -> d -> g
            Finally, m is the "middle", where the text is centered
            */

            const coords = {
                a: [gene.start - start, yOffset],
                b: [gene.end - start - pointLength, yOffset],
                c: [gene.end - start, yOffset],
                d: [gene.end - start, yOffset + geneHeight / 2],
                e: [gene.end - start, yOffset + geneHeight],
                f: [gene.end - start - pointLength, yOffset + geneHeight],
                g: [gene.start - start, yOffset + geneHeight],
                m: [gene.start - start + geneLength / 2, yOffset + geneHeight]
            };

            // Scale all widths
            for (const key in coords) {
                coords[key][0] = X_PADDING + widthScale.mul(coords[key][0]).valueOf();
                coords[key][1] = coords[key][1].valueOf();
            }

            const triangle = geneLength <= pointLength;

            // Generate the path with the power of if-statements
            const path = Path()
                .moveTo(...coords.a);
            if (!triangle)
                path.lineTo(...coords.b);
            if (rounded)
                path.bezierCurveTo(...coords.c, ...coords.d);
            else
                path.lineTo(...coords.d);

            if (!triangle) {
                if (rounded)
                    path.bezierCurveTo(...coords.e, ...coords.f);
                else
                    path.lineTo(...coords.f);
                path.lineTo(...coords.g);
            }
            else {
                if (rounded)
                    path.bezierCurveTo(...coords.e, ...coords.g);
                else
                    path.lineTo(...coords.g);
            }
            path.lineTo(...coords.a);

            return (
                <g>
                    <path d={path.end()} fill={gene.color}/>
                    <text
                        x={coords.m[0]}
                        y={coords.m[1] + 2}
                        textAnchor="end"
                        fill={TEXT_COLOR}
                        fontSize={fontSize}
                        transform={`rotate(315, ${coords.m[0]}, ${coords.m[1]})`}
                    >{gene.text}</text>
                </g>
            );
        });
    }

    // const viewBox = `0 0 ${width} ${height}`;
    return (
        <Grid direction={'row'} container justify={'center'}>
            <Grid direction={'row'} xs={12} justify={'center'} item>
                <ResizingSvg ref={svgRef} style={{
                    width: '100%'
                }}>
                    <SvgLayout mode="height">
                        <DiagramScale
                            xOffsetStart={X_PADDING}
                            xOffsetEnd={X_PADDING + displayLength}
                            valueStart={start}
                            valueEnd={end}
                            majorTickHeight={MAJOR_TICK}
                            minorTickHeight={MINOR_TICK}
                            // majorTickWidth={0.2}
                            // minorTickWidth={0.05}
                            {...scaleProps}
                        />
                        <Genes/>
                    </SvgLayout>
                </ResizingSvg>
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
    
    geneHeight: PropTypes.number
};

GenePlot.defaultProps = {
    geneHeight: 200,
    scaleProps: {},
    fontSize: 20,
    width: 800,
    // height: 15,
    padding: 0.1,
    pointLength: 500,
    scaleProportion: 0.3,
    rounded: false
};