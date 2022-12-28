import React from 'react';
import './styles.css'


const Selector = (props: {options: string[], selected: string, changeHandler: (newSelect: string) => void}) => {
    return (
        <div className="selector__container">
            <select className="selector" onChange={(e) => props.changeHandler(e.target.value)}>
                {props.options && props.options.map(o => <option className="option" key={o}>{o}</option>)}
            </select>
        </div>
    );
};

export default Selector;