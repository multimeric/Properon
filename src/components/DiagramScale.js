import React, {useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';

function getTicks(minorTick, majorTick, valueStart, valueEnd, endTicks){
    // Start with one major tick for the start and end
    const minorTicks = [];
    const majorTicks = endTicks ? [valueStart, valueEnd] : [];
    
    // Calculate the other ticks
    for (let i = valueStart; i <= valueEnd; i++) {
        if (i % majorTick === 0) {
            majorTicks.push(i);
            continue;
        }

        if (i % minorTick === 0) {
            minorTicks.push(i);
        }
    }
    
    return [minorTicks, majorTicks];
}

/**
 * The scale a diagram, including ticks
 */
export default function DiagramScale(props) {
    const {color, valueStart, valueEnd, xOffsetStart, xOffsetEnd, yOffsetStart, yOffsetEnd, minorTick, majorTick,  minorTickWidth, majorTickWidth, fontSize, lineWidth, endTicks} = props;
    // The range of genomic coordinates
    const valueRange = valueEnd - valueStart;
    // How much to scale the width, in terms of SVG units per genomic unit
    const widthScale = (xOffsetEnd - xOffsetStart) / valueRange;
    
    const height = yOffsetEnd - yOffsetStart;
    
    // The genomic positions of each minor and major tick
    const [minorTicks, majorTicks] = getTicks(minorTick, majorTick, valueStart, valueEnd, endTicks);

    // The height of the labels, in SVG units. We start by guessing it at 10, but ultimately calculate it after the 
    // first render pass
    const [labelSize, setLabelSize] = useState(10);
    const labelGroup = useRef();
    // Calculate the label height. Rerun this whenever the props change
    useEffect(() => {
        const dims = labelGroup.current.getBBox();
        setLabelSize(dims.height);
    }, [props]);
    
    const labelSectionHeight = 2 * labelSize;
    const tickSectionHeight = height - labelSectionHeight;
    const majorTickHeight = tickSectionHeight / 2;
    const minorTickHeight = tickSectionHeight / 4;
    const scalePos = (tickSectionHeight / 2) + labelSectionHeight;

    return (
        <g className="scale">
            <line className="scale-line" strokeWidth={lineWidth} stroke="black" x1={xOffsetStart} x2={xOffsetEnd}
                  y1={scalePos} y2={scalePos}/>
            <g className="minorTicks">
                {
                    minorTicks.map(tick => {
                        const x = xOffsetStart + (tick - valueStart) * widthScale;
                        return (
                            <line
                                className="scale-minor-tick"
                                x1={x}
                                x2={x}
                                y1={scalePos - minorTickHeight}
                                y2={scalePos + minorTickHeight}
                                stroke={color}
                                strokeWidth={minorTickWidth}
                            />
                        );
                    })
                }
            </g>
            <g className="majorTicks">
                {
                    majorTicks.map(tick => {
                        const x = xOffsetStart + (tick - valueStart) * widthScale;
                        return (
                            <line
                                className="scale-minor-tick"
                                x1={x}
                                x2={x}
                                y1={scalePos - majorTickHeight}
                                y2={scalePos + majorTickHeight}
                                stroke={color}
                                strokeWidth={majorTickWidth}
                            />
                        );
                    })
                }
            </g>
            <g ref={labelGroup} className="tickLabels">
                {
                    majorTicks.map(tick => {
                        const x = xOffsetStart + (tick - valueStart) * widthScale;
                        return (
                            <text
                                x={x}
                                y={yOffsetStart + labelSize}
                                textAnchor="middle"
                                fontSize={fontSize}
                            >
                                {tick}
                            </text>
                        );
                    })
                }
            </g>
        </g>
    );
}

DiagramScale.propTypes = {
    /**
     * The color of the whole scale
     */
    color: PropTypes.string,

    /**
     * If the number is a multiple of this number, it's a minor tick (unless it's a major ticK)
     */
    minorTick: PropTypes.number,

    /**
     * If the number is a multiple of this number, it's a major tick
     */
    majorTick: PropTypes.number,

    /**
     * The distance from the top of the component to the horizontal line
     */
    scaleOffset: PropTypes.number,

    /**
     * The first point on the scale
     */
    valueStart: PropTypes.number,

    /**
     * Where, in the SVG coordinates, do we start the component on the x-axis
     */
    xOffsetStart: PropTypes.number,

    /**
     * Where, in the SVG coordinates, do we end the component on the x-axis
     */
    xOffsetEnd: PropTypes.number,

    /**
     * Where, in the SVG coordinates, do we start the component on the y-axis
     */
    yOffsetStart: PropTypes.number,

    /**
     * Where, in the SVG coordinates, do we end the component on the y-axis
     */
    yOffsetEnd: PropTypes.number,

    /**
     * The last point on the scale
     */
    valueEnd: PropTypes.number,

    /**
     * The height of a minor tick
     */
    minorTickHeight: PropTypes.number,

    /**
     * The width of a minor tick
     */
    minorTickWidth: PropTypes.number,

    /**
     * The height of a major tick
     */
    majorTickHeight: PropTypes.number,

    /**
     * The width of a major tick
     */
    majorTickWidth: PropTypes.number,

    /**
     * Size of the tick font
     */
    fontSize: PropTypes.number,

    /**
     * Width of the horizontal scale line
     */
    lineWidth: PropTypes.number,

    /**
     * Whether or not to add a major tick on the first and last point of the scale
     */
    endTicks: PropTypes.bool
};

DiagramScale.defaultProps = {
    color: 'black',
    minorTick: 100,
    majorTick: 1000,
    offsetStart: 0,
    offsetEnd: 100,
    scaleOffset: 10,
    valueStart: 0,
    valueEnd: 100,
    minorTickHeight: 2,
    minorTickWidth: 0.2,
    majorTickHeight: 5,
    majorTickWidth: 0.5,
    fontSize: 3,
    lineWidth: 0.1,
    endTicks: true
};
