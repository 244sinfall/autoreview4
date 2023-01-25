import ReviewerController from "./reviewer";
import {FirestoreUserData, PermissionValue} from "../../../../model/user";
import {collection, getDocs, query, setDoc, where} from "firebase/firestore";
import {db} from "../../../../model/auth/global";
import {FirestoreDataException} from "../../../../model/exceptions";

export default class AdminController extends ReviewerController{
    /**
     * @throws FirestoreDataException - на почте более одного пользователя или пользователя с такой почтой нет
     * @param forEmail емайл, которому изменить пермишн
     * @param to пермишн, на который изменить
     */
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
    private isValidAdminData(data: unknown): data is FirestoreUserData[] {
        return typeof data === "object" && data !== null && Array.isArray(data) &&
            data.every(document => typeof document === "object" && document !== null && "name" in document &&
                "permission" in document && "email" in document)
    }

    /**
     * @throws FirestoreDataException - в базе некорректная структура (тайпскрипт не смог типизировать поступившие данные)
     */
    async getAllUsers() {
        const response = await getDocs(query(collection(db, 'permissions')))
        const fetched = response.docs;
        const data = fetched.map(entry => entry.data());
        if(!this.isValidAdminData(data)) throw new FirestoreDataException("В базе пользователей " +
            "некорректная структура данных. Обратитесь к администратору")
        return data
    }
}