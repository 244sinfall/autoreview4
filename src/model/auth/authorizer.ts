import {createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from "firebase/auth";
import {auth, db} from "./global";
import {doc, setDoc} from "firebase/firestore";
import Visitor from "./user";


export type UserLoginCredentials = {
    email: string,
    password: string
}

export type UserRegOnlyCredentials = {
    passwordCheck: string,
    login: string
}

export type UserRegisterCredentials = UserLoginCredentials & UserRegOnlyCredentials

export default class Authorizer {
    private _user: Visitor
    constructor(user: Visitor) {
        if(user.authorized) throw Error("Пользователь уже авторизован")
        this._user = user
    }
    async login(credentials: UserLoginCredentials) {
        if(!credentials.password || !credentials.email || !credentials.email.includes("@")) throw Error("Не все поля заполнены")
        const result = await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
        return result.user
    }
    async signup(credentials: UserRegisterCredentials) {
        if (credentials.password !== credentials.passwordCheck) throw Error("Пароли не совпадают")
        if (!credentials.password || !credentials.email || !credentials.login) throw Error("Не все поля заполнены")
        const {email, password} = credentials
        const result = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(result.user, {displayName: credentials.login})
        await setDoc(doc(db, 'permissions', result.user.uid), {
            email: result.user.email,
            name: credentials.login,
            permission: 0
        })
        return result.user
    }
}