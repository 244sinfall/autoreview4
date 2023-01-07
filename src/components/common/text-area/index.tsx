import React, {ForwardedRef, useCallback, useEffect, useState} from 'react';
import './styles.css'

type TextAreaProps = {
    className?: string,
    maxLength?: number,
    placeholder?: string,
    value?: string,
    onChange?: (newValue: string) => void
    readOnly?: boolean
    defaultValue?: string
}

const TextArea = React.forwardRef((props: TextAreaProps, ref: ForwardedRef<HTMLTextAreaElement>) => {
    const [value, setValue] = useState(props.value ?? props.defaultValue)
    const callbacks = {
        onChange: useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
            if(props.onChange) {
                props.onChange(event.target.value)
            }
            if(!props.value)
                setValue(event.target.value)
        }, [props])
    }
    useEffect(() => {
        if(props.value !== undefined) return setValue(props.value)
        if(props.defaultValue !== undefined) return setValue(props.defaultValue)
    }, [props.defaultValue, props.value])
    return (
        <textarea className={"text-area" + (props.className ? ` ${props.className}` : "")}
                  ref={ref}
                  placeholder={props.placeholder}
                  value={value}
                  maxLength={props.maxLength}
                  onChange={callbacks.onChange}
                  readOnly={props.readOnly}/>
    );
});

export default React.memo(TextArea);