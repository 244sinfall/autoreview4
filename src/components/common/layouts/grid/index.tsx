import React from 'react';
import './style.css'

const LayoutGrid = (props: { templateColumns?: string,
    templateRows?: string, autoColumns?: string, autoRows?: string, children: React.ReactNode | React.ReactNode[] }) => {
    return (
        <div className="layout-grid" style={{
            gridTemplateColumns: props.templateColumns,
            gridTemplateRows: props.templateRows,
            gridAutoColumns: props.autoColumns,
            gridAutoRows: props.autoRows
        }}>
            {props.children}
        </div>
    );
};

export default React.memo(LayoutGrid);