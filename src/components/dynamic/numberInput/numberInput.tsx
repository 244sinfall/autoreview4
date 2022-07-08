import React, {useState} from 'react';
import  '../../commonCss/input.css'

const NumberInput = (props:
                         {
                             title: string,
                             minValue: number,
                             maxValue: number,
                             handler?: (reducerFieldName: string, reducerFieldValue: number) => void,
                             disabled: boolean,
                             disabledValue?: number
                         }) => {

    let [number, setNumber] = useState(0)
    let title = props.disabled ? <strong>{props.title}:</strong> : <p>{props.title}:</p>
    function setNumberValue(event: React.ChangeEvent<HTMLInputElement>) {
        let newNumber = parseInt(event.target.value);
        newNumber = isNaN((newNumber)) || newNumber < props.minValue ? props.minValue :
            newNumber > props.maxValue ? props.maxValue : newNumber
        if(number !== newNumber) {
            setNumber(() => {
                    if(!props.disabled) {
                        event.target.value = newNumber.toString();
                        return newNumber;
                    }
                    else {
                        return props.disabledValue ?? 0;
                    }
                }
            )
            if(props.handler !== undefined) {
                props.handler(props.title, newNumber)
            }
        }
    }
    return (
        <div className="mainInput">
            {title}
            <input className="inputField" type="tel" min={props.minValue} max={props.maxValue}
                   value={props.disabledValue ?? number}
                   disabled={props.disabled}
                   onChange={(event) => setNumberValue(event)}>
            </input>
        </div>
    );
};



export default NumberInput;