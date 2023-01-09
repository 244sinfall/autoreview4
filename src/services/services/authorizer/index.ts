import Service from "../service";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from "firebase/auth";
import {auth, db} from "../../../model/auth/global";
import {doc, setDoc} from "firebase/firestore";
import {UserLoginCredentials, UserRegisterCredentials} from "../../../model/auth/authorizer";

export default class Authorizer extends Service {
    async login(credentials: UserLoginCredentials) {
        if(!credentials.password || !credentials.email || !credentials.email.includes("@")) throw Error("Не все поля заполнены")
        await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
        return
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
        return
    }
}