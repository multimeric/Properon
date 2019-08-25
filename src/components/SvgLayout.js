import React, {useRef, useEffect, useState} from 'react';
import propTypes from 'prop-types';
import useDimensions from 'react-use-dimensions';

/**
 * Component that automatically lays out child SVG components so that they are offset from each other, and are not 
 * overlapping, kind of like HTML does, but for SVG
 */
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
            let childProps, wrapperProps;
            
            if (mode === 'width'){
                childProps = {
                    xOffset: cumSums[i]                   
                };
                wrapperProps = {
                    reportWidth: setIthDims(i)
                }
            }
            else{
                childProps = {
                    yOffset: cumSums[i]
                };
                wrapperProps = {
                    reportHeight: setIthDims(i)
                }
            }
            
            const newChild = React.cloneElement(child, childProps); 
            return <SvgChild {...wrapperProps}>
                {newChild}
            </SvgChild>;
        })}
    </g>;
}

function SvgChild(props){
    const {reportHeight, reportWidth, children} = props;
    
    
    const [ref, dims] = useDimensions({
        boundsType: 'BBOX'
    });

    // useEffect(() => {
        if (reportHeight && 'height' in dims){
            reportHeight(dims.height);
        }
        
        if (reportWidth && 'width' in dims){
            reportWidth(dims.width);
        }
    // }, [dims, reportHeight, reportWidth]);
    
    // children is a single element, so we can do this
    return React.cloneElement(children, {ref})
}

SvgLayout.propTypes = {
    /**
     * Either "height" or "width", which determines which dimension we are layout out over
     */
    mode: propTypes.string,
    children: propTypes.arrayOf(propTypes.element)
};
