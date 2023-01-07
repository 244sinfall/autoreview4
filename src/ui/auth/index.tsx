import React, {useCallback, useState} from 'react';
import {useAuth} from "../../model/auth/use-auth";
import {PERMISSION} from "../../model/auth/user";
import WelcomeExistingUser from "../../components/auth/welcome-existing";
import {useNavigate} from "react-router-dom";
import WelcomeNewUser from "../../components/auth/welcome-new";
import {UserLoginCredentials, UserRegisterCredentials} from "../../model/auth/authorizer";


const AccountManager = () => {
    const {isLoading, currentUser, logout, createSession} = useAuth()
    const [errMsg, setErrMsg] = useState("")
    const nav = useNavigate();
    const callbacks = {
        onSubmit: useCallback(async(credentials: UserLoginCredentials | UserRegisterCredentials, formState: "reg" | "auth") => {
            try {
                return await createSession(credentials, formState)
            } catch (e: unknown) {
                if(e instanceof Error) {
                    setErrMsg(e.message)
                }
            }
        }, [createSession])
    }
    return (
        <>
            {currentUser.authorized ?
                <WelcomeExistingUser name={currentUser.name ?? "Загрузка..."}
                                     isAdmin={currentUser.canAccess(PERMISSION.Admin)}
                                     onAdmin={() => nav('/admin')}
                                     permissionName={isLoading ? "Загрузка..." : currentUser.permissionName}
                                     onLogout={logout}/>
            :
                <WelcomeNewUser onSubmit={callbacks.onSubmit} error={errMsg} isLoading={isLoading}/>
            }
        </>
    );
};

export default React.memo(AccountManager);