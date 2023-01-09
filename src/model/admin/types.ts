import {PermissionName} from "../user";
import {AdminUserData} from "../user/controllers/admin";

export type AdminReducerPermissionFilter = "Все" | PermissionName

export const AdminReducerPermissionFilterList: AdminReducerPermissionFilter[] = ["Все", "Админ", "Рецензент",
    "Арбитр", "ГМ", "Игрок"]

export type AdminReducerState = {
    users: AdminUserData[]
    selectedUser: AdminUserData & {error?: string} | null
    filter: {
        permission: AdminReducerPermissionFilter
        search: string
    }
    isLoading: boolean
    error: string
    page: number
}

const AdminReducerDefaultState: AdminReducerState = {
    users: [],
    selectedUser: null,
    filter: {
        permission: "Все",
        search: ""
    },
    isLoading: false,
    error: "",
    page: 1
}
export default AdminReducerDefaultState