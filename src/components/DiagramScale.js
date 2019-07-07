import React from 'react';
import PropTypes from 'prop-types';

/**
 * The scale a diagram, including ticks
 */
export default function DiagramScale(props) {
    const {color, start, end, minorTick, majorTick, yOffset, minorTickHeight, minorTickWidth, majorTickHeight, majorTickWidth, fontSize} = props;
    // How much to scale the scale. Why don't you try to come up with a better name for this variable
    const scaleScale = 100 / (end - start);
    const minorTicks = [];
    const majorTicks = [start, end];

    // Calculate the ticks
    for (let i = start; i <= end; i++) {
        if (i % majorTick === 0) {
            majorTicks.push(i);
            continue;
        }

        if (i % minorTick === 0) {
            minorTicks.push(i);
        }
    }

    return (
        <g className="scale">
            <line className="scale-line" stroke="black" x1={0} x2={100} y1={yOffset} y2={yOffset}/>
            {
                minorTicks.map(tick => {
                    return (
                        <line
                            className="scale-minor-tick"
                            x1={tick * scaleScale}
                            x2={tick * scaleScale}
                            y1={yOffset - minorTickHeight}
                            y2={yOffset + minorTickHeight}
                            stroke={color}
                            strokeWidth={minorTickWidth}
                        />
                    );
                })
            }
            {
                majorTicks.map(tick => {
                    return (
                        <g>
                            <line
                                className="scale-minor-tick"
                                x1={tick * scaleScale}
                                x2={tick * scaleScale}
                                y1={yOffset - majorTickHeight}
                                y2={yOffset + majorTickHeight}
                                stroke={color}
                                strokeWidth={majorTickWidth}
                            />
                            <text
                                x={tick * scaleScale}
                                y={yOffset - majorTickHeight}
                                textAnchor="middle"
                                fontSize={fontSize}
                            >
                                {tick}
                            </text>
                        </g>
                    );
                })
            }
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
     * The distance from the top to offset the scale
     */
    yOffset: PropTypes.number,

    /**
     * The first point on the scale
     */
    start: PropTypes.number,

    /**
     * The last point on the scale
     */
    end: PropTypes.number,

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
    fontSize: PropTypes.number
};

DiagramScale.defaultProps = {
    color: 'black',
    minorTick: 5,
    majorTick: 10,
    yOffset: 0,
    start: 0,
    end: 100,
    minorTickHeight: 2,
    minorTickWidth: 0.2,
    majorTickHeight: 5,
    majorTickWidth: 0.5,
    fontSize: 3
};
