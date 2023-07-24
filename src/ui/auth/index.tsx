import React, {useCallback, useState} from 'react';
import {PERMISSION, PermissionNameByValue} from "../../model/user";
import WelcomeExistingUser from "../../components/auth/welcome-existing";
import {useNavigate} from "react-router-dom";
import WelcomeNewUser from "../../components/auth/welcome-new";
import {UserLoginCredentials, UserRegisterCredentials} from "../../model/auth/types";
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
    const [isCaptchaDone, setIsCaptchaDone] = useState(process.env.NODE_ENV === "development")
    const nav = useNavigate();
    const validateCaptcha = useCallback(() => {
        if(isCaptchaDone) return true;
        setErrMsg("Вы не прошли проверку!")
        return false;
    }, [isCaptchaDone])
    const callbacks = {
        onRegister: useCallback(async(credentials: UserRegisterCredentials) => {
            if(!validateCaptcha()) return
            return authorizer.signup(credentials)
                .catch(e => {
                    if(e instanceof Error)
                        setErrMsg(e.message)
                })
        }, [authorizer, validateCaptcha]),
        onLogin: useCallback(async(credentials: UserLoginCredentials) => {
            if(!validateCaptcha()) return
            return authorizer.login(credentials)
                .catch(e => {
                    if(e instanceof Error)
                        setErrMsg(e.message)
                })
        }, [authorizer, validateCaptcha]),
        onCaptcha: useCallback((success: boolean) => {
            setIsCaptchaDone(process.env.NODE_ENV === "development" ? true : success);
        }, [])
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
                                onRegister={callbacks.onRegister}
                                onCaptcha={callbacks.onCaptcha}/>
            }
        </>
    );
};

export default React.memo(AccountManager);