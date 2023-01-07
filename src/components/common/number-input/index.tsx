import React, {useCallback, useEffect, useRef, useState} from 'react';
import '../common-css/input.css'

type PossibleNumberInputValues = "-" | `${number}.` | ""

export type NumberInputProps = {
    className?: string,
    minValue?: number,
    maxValue?: number,
    isFloat?: boolean,
    /**
     * При установке value, компонент станет управляем только со стороны onChange
     */
    value?: number,
    onChange?: (newValue: number) => void
    disabled?: boolean
    placeholder?: number
    defaultValue?: number
}

const NumberInput = (props: NumberInputProps) => {
    const timeoutId = useRef<NodeJS.Timeout>()
    const [value, setValue] = useState<PossibleNumberInputValues | number>(props.value ?? props.defaultValue ?? props.minValue ?? "")
    const callbacks = {
        onChange: useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
            if(timeoutId.current) clearTimeout(timeoutId.current)
            const isUnfinishedNumber = (value: string): value is PossibleNumberInputValues => {
                if(value === "") return true
                if(value === "-" && (typeof props.minValue === "undefined" || props.minValue < 0)) return true
                return !!(props.isFloat && !isNaN(parseFloat(value)) && value.endsWith('.'));
            }
            if(isUnfinishedNumber(event.target.value)) {
                return setValue(event.target.value)
            }
            let number = props.isFloat ? parseFloat(event.target.value) : parseInt(event.target.value)
            if(!isNaN(number)) {
                if(typeof props.minValue !== "undefined" && number < props.minValue) number = props.minValue
                if(typeof props.minValue !== "undefined" && props.maxValue && number > props.maxValue) number = props.maxValue
                if(props.onChange)  props.onChange(number);
                setValue(number)
            } else {
                timeoutId.current = setTimeout(() => {
                    setValue(props.value ?? props.defaultValue ?? props.minValue ?? "")
                }, 500)
            }
        }, [props])
    }
    useEffect(() => {
        if(props.value)
            setValue(props.value)
    }, [props.value])
    return (
        <input  className={"input number_input" + (props.className ? ` ${props.className}` : '')}
                   type="tel"
                   min={props.minValue}
                   max={props.maxValue}
                   value={value}
                   disabled={props.disabled}
                   onChange={callbacks.onChange}
                   defaultValue={props.defaultValue}
                   placeholder={String(props.placeholder ?? "")}
        />
    );
};



export default React.memo(NumberInput);