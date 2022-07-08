import React from 'react';
import './textArea.css'

const TextArea = (props: { review?: string }) => {
    return (
        <div className='textArea__frame'>
            <textarea className='textArea' value={props.review} readOnly={true}></textarea>
        </div>
    );
};

export default TextArea;