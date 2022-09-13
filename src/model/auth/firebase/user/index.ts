import {User} from "firebase/auth";
import {collection, doc, getDoc, getDocs, query, setDoc, where} from "firebase/firestore";
import {Permission} from "./model";
import {db} from "../global";

export class AuthorizedUser {
    private _user: User
    private _permission: Permission | null
    constructor(user: User) {
        this._user = user
        this._permission = null
    }
    displayName() {
        return this._user.displayName
    }
    async getAllUsers() {
        if(this._permission && this._permission >= Permission.admin) {
            const fetched = await getDocs(query(collection(db, 'permissions')))
            return fetched.docs.map((d) => d.data())
        }
    }
    async changeRole(forEmail: string, to: Permission) {
        if(this._permission && this._permission >= Permission.admin) {
            try {
                const col = collection(db, 'permissions')
                const q = query(col, where('email', '==', forEmail))
                const result = await getDocs(q)
                const reference = result?.docs[0].ref
                await setDoc(reference, {permission: to}, {merge: true})
            } catch(e) {
                console.log(e)
            }

        }
    }
    permission() {
        return this._permission
    }
    canAccess(permission: Permission) {
        if(this._permission === null) return false
        return this._permission >= permission
    }
    isLoaded() {
        return this._permission !== null
    }
    async fetchPermission() {
        const document = await getDoc(doc(db, 'permissions', this._user.uid))
        const data = await document.data()
        this._permission = data?.permission as Permission ?? Permission.player
    }
}