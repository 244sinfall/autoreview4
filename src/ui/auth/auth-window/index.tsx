import React, {useCallback, useEffect, useState} from 'react';
import TextInput from "../../../components/common/dynamic/text-input";
import ActionButton from "../../../components/common/static/action-button";
import LoadingSpinner from "../../../components/common/static/loading-spinner";
import {useAuth} from "../../../model/auth/use-auth";
import Authorizer, {UserInfo} from "../../../model/auth/authorizer";
import AuthorizedUser from "../../../model/auth/user/authorized-user";
import {useAppDispatch} from "../../../model/hooks";
import {setUser} from "../../../model/auth/user/reducer";

enum AuthFields {
    name = "Ник на Darkmoon",
    password = "Пароль",
    passwordCheck = "Еще раз пароль",
    email= "E-mail",
}

const AuthWindow = (props: {isLoading: boolean}) => {
    const [isRegistering, setIsRegistering] = useState(false)
    const [userInfo, setUserInfo] = useState<UserInfo>(Authorizer.defaultState)
    const [errMsg, setErrMsg] = useState("")
    const {currentUser} = useAuth()
    const dispatch = useAppDispatch()
    useEffect(() => {
        setErrMsg("")
    }, [isRegistering])
    const handleError = (msg: any) => {
        if(msg.code?.includes("user-not-found")) return setErrMsg("Пользователя не существует")
        if(msg.code?.includes("email-already")) return setErrMsg("Такая почта уже зарегистрирована")
        if(msg.code?.includes("invalid")) return setErrMsg("Некорректные данные")
        if(msg.code?.includes("wrong-password")) return setErrMsg("Неверный пароль")
        setErrMsg(msg.message)
    }
    const callbacks = {
        handleFields: useCallback((fieldName: string, fieldValue: string) => {
            switch (fieldName) {
                case AuthFields.email:
                    setUserInfo({...userInfo, email: fieldValue})
                    break
                case AuthFields.name:
                    setUserInfo({...userInfo, name: fieldValue})
                    break
                case AuthFields.password:
                    setUserInfo({...userInfo, password: fieldValue})
                    break
                case AuthFields.passwordCheck:
                    setUserInfo({...userInfo, passwordCheck: fieldValue})
                    break
            }
        }, [userInfo]),
        handleLogin: useCallback(async() => {
            if(currentUser.authorized) throw new Error("Пользователь уже авторизован")
            const authorizer = new Authorizer(currentUser, userInfo)
            await authorizer.login().catch((e: any) => handleError(e))
        }, [currentUser, userInfo]),
        handleSignUp: useCallback(async() => {
            if(currentUser.authorized) throw new Error("Пользователь уже авторизован")
            const authorizer = new Authorizer(currentUser, userInfo)
            const user = await authorizer.signup().catch((e: any) => handleError(e))
            if(user) {
                const authUser = await new AuthorizedUser(user)
                await dispatch(setUser(authUser))
            }
        }, [currentUser, dispatch, userInfo]),
        handleModeSwitch: useCallback(() => setIsRegistering(prevState => !prevState), []),
    }
    const handleKeySubmit = async (e: any) => {
        if(e.code === "Enter") {
            const callback = isRegistering ? callbacks.handleSignUp : callbacks.handleLogin
            await callback()
        }
    }
    return (
        <LoadingSpinner spin={props.isLoading}>
            <form className="auth-window" onKeyDown={handleKeySubmit}>
                {isRegistering && <TextInput title={AuthFields.name} placeholder={"rolevik dima"} maxLength={64}
                                             handler={callbacks.handleFields}/>}
                <TextInput title={AuthFields.email} placeholder={"rolevikdima@gmail.com"} maxLength={128}
                           handler={callbacks.handleFields}/>
                <TextInput title={AuthFields.password} placeholder={"123456"} maxLength={64} password={true}
                           handler={callbacks.handleFields}/>
                {isRegistering && <TextInput title={AuthFields.passwordCheck} placeholder={"123456"} maxLength={64}
                                             password={true} handler={callbacks.handleFields}/>}
                <p style={{color: "red"}}>{errMsg}</p>
                <div className='auth-window__controls'>
                    {!isRegistering && <ActionButton title={"Войти"} show={true}
                                                     action={callbacks.handleLogin} requiresLoading={true}/>}
                    {isRegistering && <ActionButton title={"Зарегистрироваться"} show={true}
                                                    action={callbacks.handleSignUp} requiresLoading={true}/>}
                    <ActionButton title={isRegistering ? "К авторизации" : "К регистрации"} show={true}
                                  action={callbacks.handleModeSwitch} requiresLoading={false}/>
                </div>
            </form>
        </LoadingSpinner>
    )
}

export default React.memo(AuthWindow);