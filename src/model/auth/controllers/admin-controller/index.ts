import {collection, getDocs, query, setDoc, where} from "firebase/firestore";
import {db} from "../../global";
import Visitor, {PERMISSION, PermissionValue} from "../../user";
import {FirestoreDataException, NoAccessException} from "../../exceptions";
import {AdminUserData} from "./types";

export default class AdminController {
    _user: Visitor
    constructor(user: Visitor) {
        if(!user.canAccess(PERMISSION.Admin)) throw new NoAccessException("Контроллер доступен только администраторам")
        this._user = user
    }
    async changeRole(forEmail: string, to: PermissionValue) {
        const col = collection(db, 'permissions')
        const q = query(col, where('email', '==', forEmail))
        const result = await getDocs(q)
        const resultReference = result.docs
        if(resultReference.length === 0) throw new FirestoreDataException("Пользователя нет в коллекции прав.")
        if(resultReference.length > 1) throw new FirestoreDataException("На одной почте более одного пользователя. " +
            "Обратитесь к администратору.")
        await setDoc(result.docs[0].ref, {permission: to}, {merge: true})
    }
    private isValidAdminData(data: unknown): data is AdminUserData[] {
        return typeof data === "object" && data !== null && Array.isArray(data) &&
            data.every(document => typeof document === "object" && document !== null && "name" in document &&
                "permission" in document && "email" in document)
    }
    async getAllUsers() {
        const response = await getDocs(query(collection(db, 'permissions')))
        const fetched = response.docs;
        const data = fetched.map(entry => entry.data());
        if(!this.isValidAdminData(data)) throw new FirestoreDataException("В базе пользователей " +
            "некорректная структура данных. Обратитесь к администратору")
        return data
    }
}