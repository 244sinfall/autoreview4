import {collection, getDocs, query, setDoc, where} from "firebase/firestore";
import {db} from "../../global";
import {Permission} from "../../user";
import AuthorizedUser from "../../user/authorized-user";

export class AdminController {
    _user: AuthorizedUser
    constructor(user: AuthorizedUser) {
        if(!user.canAccess(Permission.admin)) throw new Error("Недостаточно прав")
        this._user = user
    }
    async changeRole(forEmail: string, to: Permission) {
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
    async getAllUsers() {
        const fetched = await getDocs(query(collection(db, 'permissions')))
        return fetched.docs.map((d) => d.data())
    }
}