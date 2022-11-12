import React from 'react';
import './style.css'

const LayoutBlock = (props: {children: React.ReactNode | React.ReactNode[]}) => {
    return (
        <div className="layout-block">
            {props.children}
        </div>
    );
};


export default React.memo(LayoutBlock);