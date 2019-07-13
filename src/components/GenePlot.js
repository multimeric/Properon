import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import Path from 'svg-path-generator';
import FileSaver from 'file-saver';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Fraction from 'fraction.js';

import DiagramScale from './DiagramScale';

export default function GenePlot(props) {
    const {start, end, width, height, padding, pointLength, scaleProportion, genes, scaleProps, rounded, fontSize} = props;

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
    const MAJOR_TICK = 0.05 * height;
    const MINOR_TICK = 0.02 * height;

    // 30% of the plot is the scale, and 70% is the gene
    const SCALE_HEIGHT = scaleProportion * height;
    const GENE_HEIGHT = (1 - scaleProportion) * height;

    // The length of the pointy bit of the gene symbol, in SVG units
    const POINT_LENGTH = pointLength * width;
    const TEXT_COLOR = 'white';

    const viewBox = `0 0 ${width} ${height}`;
    return (
        <Grid direction={'row'} container justify={'center'}>
            <Grid direction={'row'} xs={12} justify={'center'} item>
                <svg ref={svgRef} viewBox={viewBox} style={{
                    width: '100%'
                }}>

                    {/*
                        The scale should take up about 20% of the height of the diagram,
                        so it should sit 10% from the top, and the ticks should each go 5% on each side
                    */}
                    <DiagramScale
                        xOffsetStart={X_PADDING}
                        xOffsetEnd={X_PADDING + displayLength}
                        yOffsetStart={0}
                        yOffsetEnd={SCALE_HEIGHT}
                        valueStart={start}
                        valueEnd={end}
                        majorTickHeight={MAJOR_TICK}
                        minorTickHeight={MINOR_TICK}
                        majorTickWidth={0.2}
                        minorTickWidth={0.05}
                        fontSize={fontSize}
                        {...scaleProps}
                    />
                    {genes.map(gene => {
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
                            a: [gene.start - start, SCALE_HEIGHT],
                            b: [gene.end - start - POINT_LENGTH, SCALE_HEIGHT],
                            c: [gene.end - start, SCALE_HEIGHT],
                            d: [gene.end - start, SCALE_HEIGHT + GENE_HEIGHT / 2],
                            e: [gene.end - start, SCALE_HEIGHT + GENE_HEIGHT],
                            f: [gene.end - start - POINT_LENGTH, SCALE_HEIGHT + GENE_HEIGHT],
                            g: [gene.start - start, SCALE_HEIGHT + GENE_HEIGHT],
                            m: [gene.start - start + geneLength / 2, SCALE_HEIGHT + GENE_HEIGHT / 2]
                        };

                        // Scale all widths
                        for (const key in coords) {
                            coords[key][0] = X_PADDING + widthScale.mul(coords[key][0]).valueOf();
                            coords[key][1] = coords[key][1].valueOf();
                        }

                        const triangle = geneLength <= POINT_LENGTH;

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
                        else{
                            if (rounded)
                                path.bezierCurveTo(...coords.e, ...coords.g);
                            else
                                path.lineTo(...coords.g);
                        }
                        path.lineTo(...coords.a);

                        return (
                            <g>
                                <path d={path.end()} fill={gene.color}/>
                                <text x={coords.m[0]} y={coords.m[1] + 2} textAnchor="middle" fill={TEXT_COLOR}
                                      fontSize={fontSize}>{gene.text}</text>
                            </g>
                        );
                    })}
                </svg>
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
    rounded: PropTypes.bool
};

GenePlot.defaultProps = {
    scaleProps: {},
    fontSize: 1,
    width: 100,
    height: 15,
    padding: 0.1,
    pointLength: 0.5,
    scaleProportion: 0.3,
    rounded: true
};