import React from 'react';
import ContentTitle from "../../common/content-title";
import ActionButton from "../../common/action-button";
import './styles.css'
import {useNavigate} from "react-router-dom";

const ProtectorNoAccess = () => {
    const nav = useNavigate()
    return (
        <ContentTitle className="protector-no-access" title={"Ошибка"} collapsable={false}>
            <p>У вас нет доступа к этому разделу.</p>
            <span className="protector-no-access-button">
                <ActionButton title={"Вернуться на главную"} onClick={() => nav('/')}/>
            </span>
        </ContentTitle>
    );
};

export default ProtectorNoAccess;