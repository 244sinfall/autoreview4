import React from 'react';
import './style.css'
import ContentTitle from "../../components/static/content-title";
import {getPermissionName, useAuth} from "../../model/auth";
import LoadingSpinner from "../../components/static/loading-spinner";
import WelcomeMessage from "./welcome-message";
import AuthWindow from "./auth-window";



const AccountManager = () => {
    const {isLoading, currentUser, logout} = useAuth()
    return (
        <ContentTitle title={currentUser ? "Аккаунт" : "Авторизация"}>
            <LoadingSpinner spin={isLoading}>
            {currentUser ? <WelcomeMessage name={currentUser.displayName() ?? ""}
                                           isAdmin={currentUser.canAccess(2)} permission={isLoading ? "Загрузка..." : getPermissionName(currentUser.permission())} logoutCallback={logout}/>
            : <AuthWindow isLoading={isLoading}/>}
            </LoadingSpinner>
        </ContentTitle>
    );
};

export default React.memo(AccountManager);