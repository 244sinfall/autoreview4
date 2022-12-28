import React, {useEffect, useRef} from 'react';
import {ReactComponent as CloseButton} from '../../../../assets/close_cross.svg'
import './style.css';


const ModalTitle = (props: { title: string, closeCallback?: () => void, children: React.ReactNode[] | React.ReactNode }) => {
    let wrapper = useRef<HTMLDivElement | null>(null)
    let background = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        const onClose = (e: KeyboardEvent) => {
            if(e.code === "Escape" && props.closeCallback) {
                props.closeCallback()
            }
        }

        document.addEventListener("keydown", onClose)
        return () => {
            document.removeEventListener("keydown", onClose)
        }
    }, [props])

    useEffect(() => {
        if(background && background.current && wrapper && wrapper.current) {
            const onClickOutside = (e: MouseEvent) => {
                const el = wrapper.current!
                if(!el.contains(e.target as Node) && props.closeCallback) {
                    props.closeCallback()
                }
            }
            background.current?.addEventListener("click", onClickOutside)
            const node = background.current!
            return () => node.removeEventListener("click", onClickOutside)
        }
    }, [props, wrapper])
    
    return (
        <div className="modal-background" ref={background}>
            <div className="modal-wrapper" ref={wrapper}>
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