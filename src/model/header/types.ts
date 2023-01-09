import {PermissionValue} from "../user";

export interface Types {
    menuName: string,
    menuRoute?: string,
    accessLevel?: PermissionValue
    action?: () => void
}