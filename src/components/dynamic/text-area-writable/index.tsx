import React, {useEffect, useState} from 'react';
import '../../common-css/text-area.css'

const TextAreaWritable = (props: { height?: number, content?: string, handler?: (value: string) => void }) => {
    const [localContent, setLocalContent] = useState<string>(props.content ?? "")
    useEffect(() => {
        if(props.content !== undefined && props.content !== localContent) {
            setLocalContent(props.content)
        }
    }, [localContent, props])
    return (
        <div className='text-area__frame'>
            <textarea className='text-area' style={{height: props.height ? props.height + 'px' : "100%"}}
                      readOnly={false} value={localContent} onChange={(e) => {
                setLocalContent(e.target.value)
                props.handler?.(e.target.value)}}/>
        </div>
    );
};

export default TextAreaWritable;