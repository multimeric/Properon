import React, {useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import SvgLayout from './SvgLayout';

function getTicks(minorTick, majorTick, valueStart, valueEnd, endTicks) {
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


const DiagramLabels = React.forwardRef(function DiagramLabels(props, ref) {
    const {
        valueStart,
        xOffsetStart,
        yOffset,
        fontSize,
        majorTicks,
        widthScale,
    } = props;
    return <g ref={ref} className="tickLabels">
        {
            majorTicks.map(tick => {
                const x = xOffsetStart + (tick - valueStart) * widthScale;
                return (
                    <text
                        dominantBaseline={"hanging"}
                        x={x}
                        y={yOffset}
                        textAnchor="middle"
                        fontSize={fontSize}
                    >
                        {tick}
                    </text>
                );
            })
        }
    </g>;
});

const DiagramLine = React.forwardRef(function DiagramLine(props, ref) {
    const {
        color,
        valueStart,
        xOffsetStart,
        xOffsetEnd,
        yOffset,
        minorTicks,
        majorTicks,
        minorTickHeight,
        majorTickHeight,
        minorTickWidth,
        majorTickWidth,
        lineWidth,
        widthScale,
    } = props;
    const baseline = yOffset + majorTickHeight;
    
    return (
        <g className="scale" ref={ref}>
            <line
                className="scale-line"
                strokeWidth={lineWidth}
                stroke="black"
                x1={xOffsetStart}
                x2={xOffsetEnd}
                y1={baseline}
                y2={baseline}
            />
            }

            <g className="minorTicks">
                {
                    minorTicks.map(tick => {
                        const x = xOffsetStart + (tick - valueStart) * widthScale;
                        return (
                            <line
                                className="scale-minor-tick"
                                x1={x}
                                x2={x}
                                y1={baseline - minorTickHeight}
                                y2={baseline + minorTickHeight}
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
                                y1={baseline - majorTickHeight}
                                y2={baseline + majorTickHeight}
                                stroke={color}
                                strokeWidth={majorTickWidth}
                            />
                        );
                    })
                }
            </g>
        </g>
    );
});

/**
 * The scale a diagram, including ticks
 */
const DiagramScale = React.forwardRef(function DiagramScale(props, ref) {
    const {
        valueStart,
        valueEnd,
        xOffsetStart,
        xOffsetEnd,
        minorTick,
        majorTick,
        endTicks,
    } = props;
    // The range of genomic coordinates
    const valueRange = valueEnd - valueStart;
    // How much to scale the width, in terms of SVG units per genomic unit
    const widthScale = (xOffsetEnd - xOffsetStart) / valueRange;

    // The genomic positions of each minor and major tick
    const [minorTicks, majorTicks] = getTicks(minorTick, majorTick, valueStart, valueEnd, endTicks);

    return (
        <g ref={ref}>
            <SvgLayout mode="height">
                <DiagramLabels
                    majorTicks={majorTicks}
                    widthScale={widthScale}
                    {...props}
                />
                <DiagramLine
                    minorTicks={minorTicks}
                    widthScale={widthScale}
                    majorTicks={majorTicks}
                    {...props}
                />
            </SvgLayout>
        </g>
    );
});

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
    yOffset: PropTypes.number,

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
    endTicks: PropTypes.bool,

    /**
     * Function called whenever the height of this component can be determined
     */
    reportHeight: PropTypes.func,

    /**
     * Whether or not to show the scale
     */
    showScale: PropTypes.bool
};

DiagramScale.defaultProps = {
    color: 'black',
    minorTick: 100,
    majorTick: 1000,
    valueStart: 0,
    valueEnd: 100,
    minorTickHeight: 5,
    minorTickWidth: 1,
    majorTickHeight: 10,
    majorTickWidth: 2,
    fontSize: 15,
    lineWidth: 2,
    endTicks: true,
    showScale: true
};

export default DiagramScale;
