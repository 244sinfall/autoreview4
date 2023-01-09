import React, {useCallback, useRef, useState} from 'react';
import ActionButton from "../../common/action-button";
import './styles.css'
import LoadingSpinner from "../../common/loading-spinner";
import TextInput from "../../common/text-input";
import Field from "../../common/field";
import {UserLoginCredentials, UserRegisterCredentials, UserRegOnlyCredentials} from "../../../model/auth/authorizer";
import ContentTitle from "../../common/content-title";

type WelcomeNewUserProps = {
    isLoading: boolean,
    onRegister: (credentials: UserRegisterCredentials) => Promise<unknown>
    onLogin: (credentials: UserLoginCredentials) => Promise<unknown>
    error?: string
}

const WelcomeNewUser = (props: WelcomeNewUserProps) => {
    const value = useRef<UserLoginCredentials>({email: "", password: ""})
    const regValue = useRef<UserRegOnlyCredentials>({passwordCheck: "", login: ""})
    const [formState, setFormState] = useState<"auth" | "reg">("auth");
    
    const callbacks = {
        onSubmit: useCallback(() => {
            formState === "auth" ? props.onLogin(value.current) :
                props.onRegister(Object.assign(value.current, regValue.current))
        }, [formState, props])
    }
    
    return (
        <ContentTitle className="welcome-message" title={formState === "reg" ? "Регистрация" : "Авторизация"} collapsable={false}>
            <LoadingSpinner spin={props.isLoading}>
                <form className="auth-window" onSubmit={callbacks.onSubmit}>
                    {formState === "reg" &&
                      <Field title={"Логин"}>
                        <TextInput placeholder={"rolevik dima"} maxLength={64} disabled={props.isLoading}
                                                 onChange={login => regValue.current.login = login}/>
                      </Field>}
                    <Field title="E-Mail">
                        <TextInput placeholder={"rolevikdima@gmail.com"} maxLength={128} disabled={props.isLoading}
                               onChange={email => value.current.email = email} autoComplete={"current-email"}/>
                    </Field>
                    <Field title="Пароль">
                        <TextInput placeholder={"123456"} maxLength={64} type={"password"} disabled={props.isLoading}
                               onChange={password => value.current.password = password} autoComplete={"current-password"}/>
                    </Field>
                    {formState === "reg" &&
                      <Field title="Еще раз пароль">
                      <TextInput placeholder={"123456"} maxLength={64}
                                 type={"password"} disabled={props.isLoading}
                                 onChange={password => regValue.current.passwordCheck = password}/>
                      </Field>}
                    {props.error && <p className="auth-window__error">{props.error}</p>}
                    <div className='auth-window__controls'>
                        {formState === "auth" && <ActionButton title={"Войти"} type={"submit"}
                                                               disabled={props.isLoading}
                                                         onClick={callbacks.onSubmit}/>}
                        {formState === "reg" && <ActionButton title={"Зарегистрироваться"} type={"submit"}
                                                        disabled={props.isLoading} onClick={callbacks.onSubmit}/>}
                        <ActionButton title={formState === "reg" ? "К авторизации" : "К регистрации"}
                                      onClick={() => setFormState(prev => prev === "reg" ? "auth" : "reg")} />
                    </div>
                </form>
            </LoadingSpinner>
        </ContentTitle>
    );
};

export default React.memo(WelcomeNewUser);