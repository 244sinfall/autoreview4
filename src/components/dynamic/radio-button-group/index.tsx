import React from 'react';
import './style.css'

const RadioButtonGroup = (props: { title: string, options: string[], groupName: string, defaultValue?: string,
    handler?: (value: string) => void }) => {
    const buttons = props.options && props.options.map((option, index)=> {
        const className = index === 0 ? ' button-group__button-bordered-left' :
            index === props.options.length-1 ? ' button-group__button-bordered-right' : ''
        return (
        <div className={'button-group__button-container' + className} key={option+"container"} onClick={() => props.handler?.(option)}>
            <input className={'button-group__button-input'} key={option+"input"} type="radio" id={option+props.groupName}
                   name={props.groupName} value={option} checked={props.defaultValue ? option === props.defaultValue : undefined}/>
            <label className={"button-group__button-label"} key={option+"label"} htmlFor={option+props.groupName}>
                {option}
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