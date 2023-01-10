import React, {useCallback, useState} from 'react';
import ReactTooltip from "react-tooltip";
import './style.css'
import LoadingSpinner from "../loading-spinner";

type ActionButtonProps = {
    className?: string
    title: string
    onClick?: (() => void) | (() => Promise<void>)
    tooltip?: string
    type?: "button" | "submit" | "reset"
    disabled?: boolean
}

const ActionButton = (props: ActionButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const onAction = useCallback((e: React.MouseEvent) => {
        if(!props.onClick) return;
        e.preventDefault()
        const returnValue = props.onClick()
        if(returnValue instanceof Promise) {
            setIsLoading(true)
            returnValue.finally(() => setIsLoading(false))
        }
    }, [props])
    return (
         <LoadingSpinner spin={isLoading}>
             <button className={"action-button" + (props.className ? ` ${props.className}` : "")}
                     type={props.type ?? "button"}
                     data-tip={props.tooltip}
                     onClick={onAction}
                     disabled={props.disabled}>
                 {isLoading ? 'Загрузка...' : props.title}
                 <ReactTooltip place={"top"}
                               delayShow={500}
                               multiline={true}
                               html={false}
                               backgroundColor={"var(--accent-background)"}
                               textColor={"var(--accent-color)"}/>
             </button>
         </LoadingSpinner>
    );
};

export default ActionButton;