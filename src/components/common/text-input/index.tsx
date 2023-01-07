import React, {ForwardedRef, HTMLInputTypeAttribute, useCallback, useEffect, useState} from 'react';
import '../common-css/input.css'

type TextInputProps = {
    className?: string,
    type?: HTMLInputTypeAttribute,
    maxLength?: number,
    pattern?: string | RegExp,
    placeholder?: string,
    value?: string,
    onChange?: (newValue: string) => void
    disabled?: boolean
    defaultValue?: string
    autoComplete?: string

}
const TextInput = React.forwardRef((props: TextInputProps, ref: ForwardedRef<HTMLInputElement>) => {
    const [value, setValue] = useState(typeof props.value !== "undefined" ? props.value :
                                        typeof props.defaultValue !== "undefined" ? props.defaultValue : "")
    const callbacks = {
        onChange: useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
            if(props.onChange) {
                props.onChange(event.target.value)
            }
            setValue(event.target.value)
        }, [props])
    }
    useEffect(() => {
        if(props.value !== undefined) return setValue(props.value)
        if(props.defaultValue !== undefined) return setValue(props.defaultValue)
    }, [props.defaultValue, props.value])
    return (
        <input ref={ref}
               className={"input text_input" + (props.className ? ` ${props.className}` : "")}
               type={props.type ?? "text"}
               placeholder={props.placeholder}
               value={value}
               disabled={props.disabled}
               onChange={callbacks.onChange}
               maxLength={props.maxLength}
               autoComplete={props.autoComplete}
        />
    );
});

export default React.memo(TextInput);