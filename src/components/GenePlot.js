import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import Path from 'svg-path-generator';

import DiagramScale from './DiagramScale'

export default function GenePlot(props) {
    const {start, end, genes, rounded} = props;
    const svgRef = useRef();
    const displayLength = end - start + 1;
    const widthScale = 100 / displayLength;

    // Constants
    const SCALE_Y = 20;
    const POINT_LENGTH = 10;
    const GENE_HEIGHT = 20;
    const TEXT_COLOR = 'white';

    const viewbox = `0 0 100 100`;
    return (
        <div>
        <svg ref={svgRef} viewBox={viewbox} style={{
            width: '100%'
        }}>
            <DiagramScale
                start={start}
                end={end}
                yOffset={SCALE_Y}
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
                    a: [gene.start - start, SCALE_Y],
                    b: [gene.end - start - POINT_LENGTH, SCALE_Y],
                    c: [gene.end - start, SCALE_Y],
                    d: [gene.end - start, SCALE_Y + GENE_HEIGHT / 2],
                    e: [gene.end - start, SCALE_Y + GENE_HEIGHT],
                    f: [gene.end - start - POINT_LENGTH, SCALE_Y + GENE_HEIGHT],
                    g: [gene.start - start, SCALE_Y + GENE_HEIGHT],
                    m: [gene.start - start + geneLength / 2, SCALE_Y + GENE_HEIGHT / 2]
                };

                // Scale all widths
                for (const key in coords) {
                    coords[key][0] = widthScale * coords[key][0];
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
                if (rounded)
                    path.bezierCurveTo(...coords.e, ...coords.f);
                else
                    path.lineTo(...coords.f);
                if (!triangle)
                    path.lineTo(...coords.g);
                path.lineTo(...coords.a);

                return (
                    <g>
                        <path d={path.end()} fill={gene.color}/>
                        <text x={coords.m[0]} y={coords.m[1] + 2} textAnchor="middle" fill={TEXT_COLOR}
                              fontSize={6}>{gene.text}</text>
                    </g>
                );
            })}
        </svg>
            <a></a>
            </div>
    );
}

GenePlot.propTypes = {
    start: PropTypes.number,
    end: PropTypes.number,

    // Each gene has {start, end, color, text}
    genes: PropTypes.array
};