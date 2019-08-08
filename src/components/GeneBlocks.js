import React, {useRef, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Path from 'svg-path-generator';
import useDimensions from 'react-use-dimensions';

export default function Genes(props) {
    const {
        yOffset,
        genes,
        start,
        xOffsetStart,
        xOffsetEnd,
        pointLength,
        geneHeight,
        xPadding,
        widthScale,
        centerLine,
        ...rest
    } = props;
    const lineHeight = yOffset + (geneHeight / 2);
    return <g>
        {centerLine &&
        <line x1={xOffsetStart} x2={xOffsetEnd} y1={lineHeight} y2={lineHeight} width={widthScale} stroke={'black'}/>}
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
                coords[key][0] = xPadding + (widthScale * coords[key][0]);
                coords[key][1] = coords[key][1].valueOf();
            }

            return <GeneBlock
                geneLength={geneLength}
                coords={coords}
                pointLength={pointLength}
                colour={gene.color}
                text={gene.text}
                {...rest}
            />;
        })}
    </g>;
}

function GeneBlock(props) {
    const {geneLength, coords, textColour, rounded, pointLength, fontSize, colour, text, strokeWidth} = props;
    const [textRef, textDims] = useDimensions({
        boundsType: 'BBOX'
    });

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
    path.close();

    const textX = coords.m[0];
    const textY = coords.m[1] + (textDims.height / 2);
    return (
        <g>
            <path d={path.end()} fill={colour} strokeWidth={strokeWidth} stroke={'black'}/>
            <text
                ref={textRef}
                x={textX}
                y={textY}
                textAnchor="end"
                fill={textColour}
                fontSize={fontSize}
                transform={`rotate(315, ${textX}, ${textY})`}
            >{text}</text>
        </g>
    );
}

Genes.propTypes = {
    yOffset: PropTypes.number,
    genes: PropTypes.array,
    start: PropTypes.number,
    pointLength: PropTypes.number,
    geneHeight: PropTypes.number,
    xPadding: PropTypes.number,
    widthScale: PropTypes.number,
    rounded: PropTypes.bool,
    textColour: PropTypes.string,
    fontSize: PropTypes.number,
    centerLine: PropTypes.bool,
    strokeWidth: PropTypes.number
};
