import React, {useMemo} from 'react';
import ContentTitle from "../../components/common/static/content-title";
import AuthWindow from "../auth/auth-window";
import ActionButton from "../../components/common/static/action-button";
import {useNavigate} from "react-router-dom";
import './styles.css'
import {useAuth} from "../../model/auth/use-auth";
import {PermissionValue} from "../../model/auth/user";

const Protector = (props: {children: React.ReactNode[] | React.ReactNode, accessLevel: PermissionValue}) => {
    const {currentUser, isLoading} = useAuth()
    const nav = useNavigate()

    const msg = useMemo(() => {
        const errMsg = (
            <ContentTitle title={"Ошибка"} controllable={false}>
                У вас нет доступа к этому разделу.
                <ActionButton title={"Вернуться на главную"} show={true} action={() => nav('/')} requiresLoading={false}/>
            </ContentTitle>)
        const authCheck = (
            <ContentTitle title={"Проверка авторизации"} controllable={false}>
                <AuthWindow isLoading={isLoading}/>
            </ContentTitle>
        )
        if(isLoading || !currentUser.authorized) return authCheck
        if(!currentUser.canAccess(props.accessLevel)) return errMsg
    }, [currentUser, isLoading, nav, props.accessLevel])
    return (
        <>
        {msg && <div className="protector">
            {msg}
        </div>}
            {!msg && props.children}
        </>
    );
};

export default Protector;