import React, {useRef, useEffect, useState} from 'react';
import propTypes from 'prop-types';

export default function SvgLayout(props) {
    const {mode, children} = props;
    
    // Filter out null children
    const realChildren = children.filter(child => child);

    // Start with each child having an offset of 0
    const [childDims, setChildDims] = useState(realChildren.map(() => 0));

    function setIthDims(i) {
        // Returns a function that takes a dimension and updates the state with it
        return dims => {
            // Skip if it isn't changing
            if (childDims[i] === dims)
                return;
            
            setChildDims(childDims.map((val, j) => {
                if (j === i)
                    return dims;
                else
                    return val;
            }));
        };
    }
    
    // The offsets for each element are the cumulative sums of the sizes of each element
    const cumSums = childDims.reduce((acc, curr, i) => {
        if (i === 0)
            acc.push(0);
        else
            acc.push(acc[i-1] + childDims[i-1]);
        
        return acc
    }, []);

    return <g>
        {React.Children.map(realChildren, (child, i) => {
            const props = mode === 'width' ? {
                xOffset: cumSums[i],
                reportWidth: setIthDims(i)
            } : {
                yOffset: cumSums[i],
                reportHeight: setIthDims(i)
            };
            return React.cloneElement(child, props);
        })}
    </g>;
}

SvgLayout.propTypes = {
    /**
     * Either "height" or "width", which determines which dimension we are layout out over
     */
    mode: propTypes.string,
    children: propTypes.arrayOf(propTypes.element)
};
