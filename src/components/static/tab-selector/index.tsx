import React from 'react';
import './style.css'

const TabSelector = (props: { title: string, selected: boolean, onClick: () => void }) => {
    return (
        <button className={"tab-selector" + (props.selected ? " tab-selector_selected" : "")} onClick={props.onClick}>
            {props.title}
        </button>
    );
};

export default React.memo(TabSelector);