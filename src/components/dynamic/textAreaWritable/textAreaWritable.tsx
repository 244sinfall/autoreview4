import React, {useEffect, useState} from 'react';
import '../../commonCss/textArea.css'

const TextAreaWritable = (props: { height: number, value?: string, recorder?: (value: string) => void }) => {
    const [localValue, setLocalValue] = useState<string | null>(null)
    useEffect(() => {
        if(props.value !== undefined) {
            setLocalValue(props.value)
        }
    }, [props])
    return (
        <div className='textArea__frame'>
            <textarea className='textArea' style={{height: props.height + 'px'}} readOnly={false} value={localValue ?? ""} onChange={(e) => {
                setLocalValue(e.target.value)
                props.recorder && props.recorder(e.target.value)
            }
            }></textarea>
        </div>
    );
};

export default TextAreaWritable;