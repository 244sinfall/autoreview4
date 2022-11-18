import React, {useMemo, useState} from 'react';
import  '../../common-css/input.css'

const NumberInput = (props: { title: string, minValue: number, maxValue: number, floatable?: boolean,
                             handler?: (fieldName: string, fieldValue: number) => void,
                             disabled: boolean, defaultValue?: number, value?: number }) => {
    const [number, setNumber] = useState<string | number>(props.value ?? props.defaultValue ?? props.minValue)
    const setNumberValue = (newNumberString: string) => {
        let newNumber
        if(props.floatable) {
            newNumber = newNumberString.endsWith('.') ? newNumberString : parseFloat(newNumberString);
        } else {
            newNumber = parseInt(newNumberString)
        }
        const validationNumber = Number(newNumber)
        if(isNaN(validationNumber) || validationNumber < props.minValue) newNumber = props.minValue
        if(validationNumber > props.maxValue) newNumber = props.maxValue
        if(number === newNumber) return
        setNumber(newNumber)
        props.handler?.(props.title, Number(newNumber))
    }
    const currentValue = useMemo(() => {
        if(props.value !== undefined) return props.value
        if(props.disabled) return props.defaultValue ?? number
        return number
    }, [number, props.defaultValue, props.disabled, props.value])
    return (
        <div className="input__container">
            {props.disabled ? <strong>{props.title}:</strong> : props.title}
            <input className="input__field" type="tel" min={props.minValue} max={props.maxValue}
                   value={currentValue}
                   disabled={props.disabled}
                   onChange={event => setNumberValue(event.target.value)}/>
        </div>
    );
};



export default React.memo(NumberInput);