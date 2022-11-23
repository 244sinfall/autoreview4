import React, {useEffect} from 'react';
import {ReactComponent as CloseButton} from '../../../assets/close_cross.svg'
import './style.css';


const ModalTitle = (props: { title: string, closeCallback?: () => void, children: React.ReactNode[] | React.ReactNode }) => {
    useEffect(() => {
        const onClose = (e: KeyboardEvent) => {
            if(e.code === "Escape" && props.closeCallback) {
                props.closeCallback()
            }
        }
        document.addEventListener("keydown", onClose)
        return () => document.removeEventListener("keydown", onClose)
    }, [props])
    return (
        <div className="modal-background">
            <div className="modal-wrapper">
                <div className="modal-block">
                    <span className="modal-block__title">
                        {props.title}
                        <CloseButton className="modal-block__cross" onClick={props.closeCallback}/>
                    </span>
                    <div className="modal-block__container">{props.children}</div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ModalTitle);