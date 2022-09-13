import React, {useEffect, useState} from 'react';

import TextInput from "../../../components/dynamic/text-input";
import ActionButton from "../../../components/static/action-button";
import LoadingSpinner from "../../../components/static/loading-spinner";
import {AuthFields, UserInfo} from "../../../model/auth/firebase/user/model";
import {handleLogin, handleSignUp} from "../../../model/auth/firebase/auth";

const initialState: UserInfo = {
    name: "",
    password: "",
    passwordCheck: "",
    email: "",
}

const AuthWindow = (props: {isLoading: boolean}) => {
    const [isRegistering, setIsRegistering] = useState(false)
    const [userInfo, setUserInfo] = useState<UserInfo>(initialState)
    const [errMsg, setErrMsg] = useState("")
    useEffect(() => {
        setErrMsg("")
    }, [isRegistering])
    const handler = (fieldName: string, fieldValue: string) => {
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
    }
    const handleProcess = async(callback: (data: UserInfo) => Promise<any>) => {
        if(userInfo.password.length < 6) return setErrMsg("Минимальная длина пароля - 6 символов")
        return callback(userInfo)
            .catch((msg) => {
                if(msg.code?.includes("user-not-found")) return setErrMsg("Пользователя не существует")
                if(msg.code?.includes("email-already")) return setErrMsg("Такая почта уже зарегистрирована")
                if(msg.code?.includes("invalid")) return setErrMsg("Некорректные данные")
                if(msg.code?.includes("wrong-password")) return setErrMsg("Неверный пароль")
                setErrMsg(msg.message)
        })
    }
    return (
        <div className="auth-window">
            <LoadingSpinner spin={props.isLoading}>
            {isRegistering && <TextInput title={AuthFields.name} placeholder={"rolevik dima"} maxLength={64} handler={handler}/>}
            <TextInput title={AuthFields.email} placeholder={"rolevikdima@gmail.com"} maxLength={128} handler={handler}/>
            <TextInput title={AuthFields.password} placeholder={"123456"} maxLength={64} password={true} handler={handler}/>
            {isRegistering && <TextInput title={AuthFields.passwordCheck} placeholder={"123456"} maxLength={64} password={true} handler={handler}/>}
                <p style={{color: "red"}}>{errMsg}</p>
                <div className='auth-window__controls'>
                {!isRegistering && <ActionButton title={"Войти"} show={true} action={() => handleProcess(handleLogin)} requiresLoading={true}/>}
                {isRegistering && <ActionButton title={"Зарегистрироваться"} show={true} action={() => handleProcess(handleSignUp)} requiresLoading={true}/>}
                <ActionButton title={isRegistering ? "К авторизации" : "К регистрации"} show={true} action={() => setIsRegistering(prevState => !prevState)} requiresLoading={false}/>
            </div>
            </LoadingSpinner>
        </div>
    )
}

export default AuthWindow;