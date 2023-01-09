import React, {useCallback, useState} from 'react';
import {PERMISSION, PermissionNameByValue} from "../../model/user";
import WelcomeExistingUser from "../../components/auth/welcome-existing";
import {useNavigate} from "react-router-dom";
import WelcomeNewUser from "../../components/auth/welcome-new";
import {UserLoginCredentials, UserRegisterCredentials} from "../../model/auth/authorizer";
import {createSession, destroySession} from "../../model/user/reducer";
import {useAppDispatch, useAppSelector} from "../../services/services/store";


const AccountManager = () => {
    const state = useAppSelector(state => ({
        user: state.user.user,
        isLoading: state.user.isLoading
    }))
    const dispatch = useAppDispatch()
    const [errMsg, setErrMsg] = useState("")
    const nav = useNavigate();
    const callbacks = {
        onSubmit: useCallback(async(credentials: UserLoginCredentials | UserRegisterCredentials, formState: "reg" | "auth") => {
            try {
                return dispatch(createSession({cred: credentials, formState}))
            } catch (e: unknown) {
                if(e instanceof Error) {
                    setErrMsg(e.message)
                }
            }
        }, [dispatch])
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
                <WelcomeNewUser onSubmit={callbacks.onSubmit} error={errMsg} isLoading={state.isLoading}/>
            }
        </>
    );
};

export default React.memo(AccountManager);