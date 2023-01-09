import React, {useCallback, useState} from 'react';
import {PERMISSION, PermissionNameByValue} from "../../model/user";
import WelcomeExistingUser from "../../components/auth/welcome-existing";
import {useNavigate} from "react-router-dom";
import WelcomeNewUser from "../../components/auth/welcome-new";
import {UserLoginCredentials, UserRegisterCredentials} from "../../model/auth/authorizer";
import {destroySession} from "../../model/user/reducer";
import {useAppDispatch, useAppSelector} from "../../services/services/store";
import useServices from "../../services/use-services";


const AccountManager = () => {
    const state = useAppSelector(state => ({
        user: state.user.user,
        isLoading: state.user.isLoading
    }))
    const dispatch = useAppDispatch()
    const authorizer = useServices().get("Authorizer")
    const [errMsg, setErrMsg] = useState("")
    const nav = useNavigate();
    const callbacks = {
        onRegister: useCallback(async(credentials: UserRegisterCredentials) => {
            return authorizer.signup(credentials)
                .catch(e => {
                    if(e instanceof Error)
                        setErrMsg(e.message)
                })
        }, [authorizer]),
        onLogin: useCallback(async(credentials: UserLoginCredentials) => {
            return authorizer.login(credentials)
                .catch(e => {
                    if(e instanceof Error)
                        setErrMsg(e.message)
                })
        }, [authorizer]),
    }
    return (
        <>
            {state.user.email ?
                <WelcomeExistingUser name={state.user.name ?? "Загрузка..."}
                                     isAdmin={state.user.permission >= PERMISSION.Admin}
                                     onAdmin={() => nav('/admin')}
                                     permissionName={state.isLoading ? "Загрузка..." : PermissionNameByValue[state.user.permission]}
                                     onLogout={()=> dispatch(destroySession())}/>
            :
                <WelcomeNewUser onLogin={callbacks.onLogin}
                                error={errMsg}
                                isLoading={state.isLoading}
                                onRegister={callbacks.onRegister}/>
            }
        </>
    );
};

export default React.memo(AccountManager);