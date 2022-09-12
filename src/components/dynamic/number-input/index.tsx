import React, {useState} from 'react';
import  '../../common-css/input.css'

const NumberInput = (props: { title: string, minValue: number, maxValue: number,
                             handler?: (fieldName: string, fieldValue: number) => void,
                             disabled: boolean, disabledValue?: number }) => {
    const [number, setNumber] = useState(props.minValue)
    const setNumberValue = (newNumberString: string) => {
        let newNumber = parseInt(newNumberString);
        if(isNaN(newNumber) || newNumber < props.minValue) newNumber = props.minValue
        if(newNumber > props.maxValue) newNumber = props.maxValue
        if(number === newNumber) return
        setNumber(newNumber)
        props.handler?.(props.title, newNumber)
    }
    return (
        <div className="input__container">
            {props.disabled ? <strong>{props.title}:</strong> : props.title}
            <input className="input__field" type="tel" min={props.minValue} max={props.maxValue}
                   value={props.disabledValue ?? number}
                   disabled={props.disabled}
                   onChange={event => setNumberValue(event.target.value)}/>
        </div>
    );
};



export default NumberInput;