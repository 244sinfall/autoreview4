import React, { useState} from 'react';
import './actionButton.css'

const ActionButton = (props: { title: string, show: boolean, action: () => any, tooltip: string, requiresLoading: boolean}) => {
    // const [hover, showHover] = useState(false);
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
            <button className="actionButton" type="button"
            onClick={props.requiresLoading ? awaitAction : props.action} style={props.show ? {display: "inherit"} : {display: "none"}}>
                {isLoading() ? 'Загрузка...' : props.title}
            </button>

        </div>
    );
};

export default ActionButton;