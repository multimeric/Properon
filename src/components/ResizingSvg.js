import React, {useRef, useEffect, useState} from 'react';
import propTypes from 'prop-types';

export default function ResizingSvg(props) {
    const {height, width, children, ...rest} = props;

    // Keep track of the actual SVG dimensions
    const [stateWidth, setStateWidth] = useState(1000);
    const [stateHeight, setStateHeight] = useState(1000);
    useEffect(() => {
        const dims = svgRef.current.getBBox();
        setStateWidth(dims.width);
        setStateHeight(dims.height);
    }, );

    let calcHeight = height == null ? stateHeight : height;
    let calcWidth = width == null ? stateWidth : width;

    const svgRef = useRef();
    return <svg
        ref={svgRef}
        height={calcHeight}
        width={calcWidth}
        {...rest}
    >
        {children}
    </svg>;
}

ResizingSvg.propTypes = {
    height: propTypes.number,
    width: propTypes.number,
    children: propTypes.arrayOf(propTypes.element)
};
