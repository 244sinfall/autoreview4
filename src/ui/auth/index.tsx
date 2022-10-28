import React from 'react';
import './style.css'
import ContentTitle from "../../components/static/content-title";
import LoadingSpinner from "../../components/static/loading-spinner";
import WelcomeMessage from "./welcome-message";
import AuthWindow from "./auth-window";
import {useAuth} from "../../model/auth/use-auth";
import {Permission} from "../../model/auth/user";


const AccountManager = () => {
    const {isLoading, currentUser, logout} = useAuth()
    return (
        <ContentTitle title={currentUser ? "Аккаунт" : "Авторизация"} controllable={false}>
            <LoadingSpinner spin={isLoading}>
            {currentUser.authorized ? <WelcomeMessage name={currentUser.name ?? ""}
                                           isAdmin={currentUser.canAccess(Permission.admin)} permission={isLoading ? "Загрузка..." : currentUser.permissionName} logoutCallback={logout}/>
            : <AuthWindow isLoading={isLoading}/>}
            </LoadingSpinner>
        </ContentTitle>
    );
};

export default React.memo(AccountManager);