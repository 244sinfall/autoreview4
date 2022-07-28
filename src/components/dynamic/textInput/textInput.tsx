import React, {useEffect, useState} from 'react';
import '../../commonCss/input.css'

const TextInput = (props: { 
    title: string, 
    placeholder: string,
    maxLength: number
    cacheKey?: string,
    handler?: (reducerFieldName: string, reducerFieldValue: string) => void}) => {
    let [content, setContent] = useState("");
    useEffect(() => {
         if(typeof props.cacheKey !== "undefined") {
             let key = props.cacheKey;
             let value = localStorage.getItem(key);
             if(value !== null) {
                 setContent(value);
                 if(props.handler !== undefined) {
                     props.handler(props.title, value)
                 }
             }
         }
    }, [props.cacheKey]);

    function setTextValue(event: React.ChangeEvent<HTMLInputElement>) {
        let newContent = event.target.value;
        if(newContent.length > props.maxLength) {
            return content;
        }
        setContent((prevState) => {
            if (typeof props.cacheKey !== 'undefined') {
                if (prevState !== newContent) {
                    if (!newContent) {
                        localStorage.removeItem(props.cacheKey);
                    } else {
                        localStorage.setItem(props.cacheKey, newContent);
                    }
                }
            }
            return newContent;
        });
        if(props.handler !== undefined) {
            props.handler(props.title, newContent)
        }
    }
    return (
        <div className="mainInput">
            {props.title}:
            <input className="inputField"
                   type="text"
                   placeholder={props.placeholder}
                   value={content}
                   onChange={(event) => {
                       setTextValue(event)
                   }}>
            </input>
        </div>
    );
};

export default TextInput;