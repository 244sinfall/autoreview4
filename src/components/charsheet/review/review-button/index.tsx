import React from 'react';
import ActionButton from "../../../common/action-button";
import './styles.css'

type ReviewButtonProps = {
    onButton: () => Promise<void>,
    buttonMessage: string,
    tooltip: string
}

const ReviewButton = (props: ReviewButtonProps) => {
    return (
        <span className="review-button">
            <ActionButton 
                          title={props.buttonMessage}
                          onClick={props.onButton}
                          tooltip={props.tooltip}/>
        </span>
    );
};

export default React.memo(ReviewButton);