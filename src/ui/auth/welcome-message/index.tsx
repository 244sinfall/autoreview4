import React from 'react';
import ActionButton from "../../../components/static/action-button";
import './styles.css'
import {useNavigate} from "react-router-dom";

const WelcomeMessage = (props: {name: string, permission: string, isAdmin: boolean, logoutCallback: () => void}) => {
    const nav = useNavigate()
    return (
        <div className="welcome-message">
            <p>Привет, {props.name}</p>
            <p>Уровень доступа: {props.permission}</p>
            <div className="welcome-message__controls">
                <ActionButton title={"Выйти"} show={true} action={props.logoutCallback} requiresLoading={true}/>
                {props.isAdmin && <ActionButton title={"Админка"} show={true} action={() => nav('/admin')} requiresLoading={false}/>}
            </div>

        </div>
    )
}

export default React.memo(WelcomeMessage);