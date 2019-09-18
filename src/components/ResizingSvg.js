import React, {useRef, useEffect, useState} from 'react';
import propTypes from 'prop-types';
import useDimensions from 'react-use-dimensions';

const ResizingSvg = React.forwardRef(function ResizingSvg(props, ref){
    const {height, width, children, ...rest} = props;

    const [svgRef, svgDims] = useDimensions({
        boundsType: 'BBOX',
        ref: ref
    });

    return <svg
        ref={svgRef}
        height={svgDims.height || height}
        width={svgDims.width || width}
        {...rest}
    >
        {children}
    </svg>;
});

ResizingSvg.propTypes = {
    height: propTypes.number,
    width: propTypes.number,
    children: propTypes.arrayOf(propTypes.element)
};

export default ResizingSvg;
