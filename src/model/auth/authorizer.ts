import {createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from "firebase/auth";
import {auth, db} from "./global";
import {doc, setDoc} from "firebase/firestore";
import Visitor from "./user";
import AuthorizedUser from "./user/authorized-user";

export interface UserInfo {
    name: string,
    password: string,
    passwordCheck: string,
    email: string,
}

export default class Authorizer {
    static defaultState: UserInfo = {
        name: "",
        password: "",
        passwordCheck: "",
        email: "",
    }
    private _user: Visitor
    private readonly _info: UserInfo
    constructor(user: Visitor, info: UserInfo) {
        if(user instanceof AuthorizedUser) throw Error("Пользователь уже авторизован")
        this._user = user
        this._info = info
    }
    async login() {
        if(!this._info.password || !this._info.email || !this._info.email.includes("@")) throw Error("Не все поля заполнены")
        const { email, password } = this._info
        return await signInWithEmailAndPassword(auth, email, password)
    }
    async signup() {
        if (this._info.password !== this._info.passwordCheck) throw Error("Пароли не совпадают")
        if (!this._info.password || !this._info.email || !this._info.name) throw Error("Не все поля заполнены")
        const {email, password} = this._info
        const result = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(result.user, {displayName: this._info.name})
        await setDoc(doc(db, 'permissions', result.user.uid), {
            email: result.user.email,
            name: this._info.name,
            permission: 0
        })
    }
}