import React, {useMemo, useState} from 'react';
import './style.css'
import LoadingSpinner from "../loading-spinner";

type RadioButtonGroupProps<T extends string> = {
    className?: string
    options: T[]
    groupName: string
    value?: T
    onSelectionChange?: ((value: T) => void) | ((value: T) => Promise<void>)
}

const RadioButtonGroup = <T extends string>(props: RadioButtonGroupProps<T>) => {
    const [processing, setProcessing] = useState(false)
    const buttons = useMemo(() => {
        return props.options.map((option, index)=> {
            let className = ""
            if(index === 0) className = ' button-group__button-bordered-left'
            if(index === props.options.length - 1) className += ' button-group__button-bordered-right'
            return (
                <div className={'button-group__button-container' + className} key={`container_option_${option}_${index}`}>
                    <input className={'button-group__button-input'}
                           type="radio"
                           id={`input_option_${props.groupName}_${index}`}
                           name={props.groupName} value={option}
                           onChange={() => {
                               if(props.onSelectionChange) {
                                   const returnValue = props.onSelectionChange(option);
                                   if(returnValue instanceof Promise) {
                                       setProcessing(true)
                                       returnValue.finally(() => setProcessing(false))
                                   }
                               }
                           }}
                           checked={props.value && props.value === option}/>
                    <label className={"button-group__button-label"}
                           htmlFor={`input_option_${props.groupName}_${index}`}>
                        {option}
                    </label>
                </div>)
        })
    }, [props]);
    return (
        <LoadingSpinner spin={processing}>
        <span className={'button-group' + (props.className ? ` ${props.className}` : "")}>
            {buttons}
        </span>
</LoadingSpinner>
    );
};

export default RadioButtonGroup;