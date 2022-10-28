import {User} from "firebase/auth";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../../global";
import Visitor, {Permission} from "../index";

export default class AuthorizedUser extends Visitor {
    private _user: User
    constructor(user: User) {
        super()
        this._user = user
        this._name = this._user.displayName ?? "Пользователь"
    }
    get authorized() {
        return true
    }
    async getToken() {
        return this._user.getIdToken()
    }
    get permission() {
        return this._permission
    }
    canAccess(permission: Permission) {
        if(this._permission === null) {
            this.fetchPermission()
        }
        return this._permission >= permission
    }
    isLoaded() {
        return this._permission !== null
    }
    async fetchPermission() {
        const document = await getDoc(doc(db, 'permissions', this._user.uid))
        const data = await document.data()
        this._permission = await data?.permission as Permission ?? Permission.player
        return this._permission
    }
}