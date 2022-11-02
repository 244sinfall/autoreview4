import React, {useState} from 'react';
import ReactTooltip from "react-tooltip";
import './style.css'
import LoadingSpinner from "../loading-spinner";



const ActionButton = (props: { title: string, show: boolean, action: () => any, tooltip?: string, requiresLoading: boolean}) => {
    const [loading, isLoading] = useState(false)
    async function awaitAction() {
        isLoading(true)
        props.action()?.finally(() => {
            isLoading(false)
        })
    }
    return (
         <div className='action-button__container' style={props.show ? {opacity: 1, visibility: "visible"} : {opacity: 0, visibility: "collapse"}}>
             <LoadingSpinner spin={loading}>
                 <button className="action-button" type="button" data-tip={props.tooltip}
                     onClick={props.requiresLoading ? awaitAction : props.action}>
                         {props.requiresLoading && loading  ? 'Загрузка...' : props.title}
                     {props.show && <ReactTooltip place={"top"} delayShow={500} multiline={true} html={false} backgroundColor={"var(--accent-background)"} textColor={"var(--accent-color)"}/>}
                 </button>
             </LoadingSpinner>
         </div>

    );
};

export default ActionButton;