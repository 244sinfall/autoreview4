import React from 'react';
import Field from "../../../common/field";
import TextInput from "../../../common/text-input";
import './styles.css'

type ReviewFieldProps = {
    title: string,
    onChange: (newValue: string) => void
    value?: string
    maxLength: number
    placeholder: string
}

const ReviewField = (props: ReviewFieldProps) => {
    return (
        <Field className="review-field" title={props.title} containerOptions={{collapsedOptions:{widthToCollapse: 450}}}>
            <TextInput className="review-input" onChange={props.onChange} maxLength={props.maxLength} placeholder={props.placeholder} value={props.value}/>
        </Field>
    );
};

export default React.memo(ReviewField);