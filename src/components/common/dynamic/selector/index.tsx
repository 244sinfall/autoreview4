import React from 'react';
import './styles.css'


const Selector = <T extends string>(props: {options: T[], changeHandler: (newSelect: T) => void}) => {
    return (
        <div className="selector__container">
            <select className="selector" onChange={(e) => {
                const { selectedIndex } = e.currentTarget;
                const selectedOption = props.options[selectedIndex]
                props.changeHandler(selectedOption)
            }}>
                {props.options && props.options.map(o => <option className="option" key={o}>{o}</option>)}
            </select>
        </div>
    );
};

export default Selector;