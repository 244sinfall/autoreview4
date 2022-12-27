import {PermissionValue} from "./auth/user";

export interface HeaderMenuElement {
    menuName: string,
    menuRoute?: string,
    accessLevel?: PermissionValue
    action?: () => void
}