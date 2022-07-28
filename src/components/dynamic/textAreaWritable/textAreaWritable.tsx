import React from 'react';
import '../../commonCss/textArea.css'

const TextAreaWritable = (props: { height: number, recorder?: (value: string) => void }) => {
    return (
        <div className='textArea__frame'>
            <textarea className='textArea' style={{height: props.height + 'px'}} readOnly={false} onChange={(e) => props.recorder && props.recorder(e.target.value)}></textarea>
        </div>
    );
};

export default TextAreaWritable;