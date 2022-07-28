import React from 'react';
import '../../commonCss/textArea.css'

const TextAreaReadOnly = (props: { review?: string, height?: number }) => {
    return (
        <div className='textArea__frame'>
            <textarea className='textArea' value={props.review} style={{height: props.height ? props.height + 'px' : '100%'}} readOnly={true}></textarea>
        </div>
    );
};

export default TextAreaReadOnly;