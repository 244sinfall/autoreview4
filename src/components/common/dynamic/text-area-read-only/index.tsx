import React from 'react';
import '../../common-css/text-area.css'

const TextAreaReadOnly = (props: { content?: string, height?: number }) => {
    return (
        <div className='text-area__frame'>
            <textarea className='text-area' value={props.content ?? ""}
                      style={{height: props.height ? props.height + 'px' : '100%',
                          resize: props.height ? "none" : "vertical"}}
                      readOnly={true}></textarea>
        </div>
    );
};

export default TextAreaReadOnly;