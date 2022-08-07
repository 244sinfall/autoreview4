import React from 'react';
import './style.css'

const RadioButtonGroup = (props: { title: string, options: string[], groupName: string,
    handler?: (value: string) => void }) => {
    const buttons = props.options && props.options.map((option, index)=> {
        const className = index === 0 ? ' button-group__button-bordered-left' :
            index === props.options.length-1 ? ' button-group__button-bordered-right' : ''
        return (
        <div className={'button-group__button-container'} key={option+"container"}>
            <input className={'button-group__button-input'} key={option+"input"} type="radio" id={option}
                   name={props.groupName} value={option}
                   onChange={() => props.handler?.(option)}/>
            <label key={option+"label"} htmlFor={option}>
                <p key={option+"paragraph"} className={'button-group__button-label' + className}>{option}</p>
            </label>
        </div>)
    })
    return (
        <div className='button-group'>
            {props.title}
            <div className='button-group__container'>
                {buttons}
            </div>
        </div>
    );
};

export default RadioButtonGroup;