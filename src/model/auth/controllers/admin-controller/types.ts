import {PermissionValue} from "../../user";

/**
 * Схема хранения данных о пользователе в Cloud Firestore
 */
export type AdminUserData = {
    name: string,
    permission: PermissionValue,
    email: string
}