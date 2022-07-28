import React from 'react';
import './radioButtonGroup.css'

const RadioButtonGroup = (props: { title: string, options: string[], groupName: string, handler?: (value: string) => void }) => {
    const buttons = props.options && props.options.map((option, index)=> {
        const className = index === 0 ? ' buttonGroup__buttonBorderedLeft' :
            index === props.options.length-1 ? ' buttonGroup__buttonBorderedRight' : ''
        return (
        <div className={'buttonGroup__buttonContainer'}>
            <input className={'buttonGroup__buttonInput'} key={option} type="radio" id={option} name={props.groupName} value={option} onChange={(event) => props.handler !== undefined && props.handler(event.target.value)}/>
            <label className={'buttonGroup__buttonLabel' + className} htmlFor={option}>{option}</label>
        </div>)
    })
    return (
        <div className='buttonGroup'>
            {props.title}
            <div className='buttonGroup__container'>
                {buttons}
            </div>
        </div>
    );
};

export default RadioButtonGroup;