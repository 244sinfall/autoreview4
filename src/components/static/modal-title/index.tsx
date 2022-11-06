import React from 'react';
import './style.css';


const ModalTitle = (props: { title: string, children: React.ReactNode[] | React.ReactNode }) => {
    return (
        <div className="modal-background">
            <div className="modal-wrapper">
                <div className="modal-block">
                    <span className="modal-block__title">
                        {props.title}
                    </span>
                    <div className="modal-block__container">{props.children}</div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ModalTitle);