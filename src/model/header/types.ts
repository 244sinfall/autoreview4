import {PermissionValue} from "../auth/user";

export interface Types {
    menuName: string,
    menuRoute?: string,
    accessLevel?: PermissionValue
    action?: () => void
}