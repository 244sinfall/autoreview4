import {User} from "firebase/auth";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../../global";
import Visitor, {PermissionValue} from "../index";

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
    canAccess(permission: PermissionValue) {
        if(this._permission === null) return false
        return this._permission >= permission
    }
    get isLoaded() {
        return this.permission !== null
    }
    get email() {
        return this._user.email ?? ""
    }
    async fetchPermission() {
        const document = await getDoc(doc(db, 'permissions', this._user.uid))
        const data = await document.data()
        this._permission = await data?.permission as PermissionValue ?? 0
        return
    }
}