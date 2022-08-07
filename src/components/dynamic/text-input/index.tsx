import React, {useState} from 'react';
import '../../common-css/input.css'

const TextInput = (props: { title: string, placeholder: string, maxLength: number
    cacheKey?: string, handler?: (fieldName: string, fieldValue: string) => void}) => {
    let [content, setContent] = useState(() => {
        let initialContent: string | null = null
        if(props.cacheKey) initialContent = localStorage.getItem(props.cacheKey)
        let content = initialContent ?? ""
        props.handler?.(props.title, content)
        return content

    });
    const completeSetContent = (newContent: string) => {
        if(newContent.length > props.maxLength) return;
        setContent(newContent)
        if(props.cacheKey && localStorage.getItem(props.cacheKey) !== newContent) {
            newContent ? localStorage.setItem(props.cacheKey, newContent) :
                localStorage.removeItem(props.cacheKey);
        }
        props.handler?.(props.title, newContent)
    }
    return (
        <div className="input__container">
            {props.title}
            <input className="input__field"
                   type="text"
                   placeholder={props.placeholder}
                   value={content}
                   onChange={event => completeSetContent(event.target.value)}/>
        </div>
    );
};

export default TextInput;