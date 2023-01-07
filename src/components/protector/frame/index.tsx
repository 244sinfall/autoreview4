import React from 'react';
import './styles.css'

const ProtectorFrame = (props: {children: React.ReactNode | React.ReactNode[]}) => {
    return (
        <div className="protector-frame">
            {props.children}
        </div>
    );
};

export default ProtectorFrame;