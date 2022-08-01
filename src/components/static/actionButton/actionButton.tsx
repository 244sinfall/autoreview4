import React, {useState} from 'react';
import './actionButton.css'
import ReactTooltip from "react-tooltip";


const ActionButton = (props: { title: string, show: boolean, action: () => any, tooltip?: string, requiresLoading: boolean}) => {
    const [loading, setLoading] = useState(false)
    const isLoading = () => {
        return props.requiresLoading && loading;
    }
    async function awaitAction() {
        setLoading(true)
        props.action()?.finally(() => setLoading(false))


    }

    return (
        <div className='actionButton__container'>

            <button className="actionButton" type="button" data-tip={props.tooltip}
                onClick={props.requiresLoading ? awaitAction : props.action} style={props.show ? {display: "inherit"} : {display: "none"}}>
                    {isLoading() ? 'Загрузка...' : props.title}
            </button>
            <ReactTooltip place={"top"} delayShow={500} multiline={true} html={false} backgroundColor={"#5B3E5DFF"} textColor={"white"}/>
        </div>
    );
};

export default ActionButton;