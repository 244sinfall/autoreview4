export const PERMISSION = {
    Player: 0,
    GM: 1,
    Arbiter: 2,
    Reviewer: 3,
    Admin: 4
} as const

type PermissionTitle = keyof typeof PERMISSION;

export type PermissionValue = typeof PERMISSION[PermissionTitle]

export type PermissionName = "Игрок" | "ГМ" | "Арбитр" | "Рецензент" | "Админ"
export const PermissionNames: PermissionName[] = ["Игрок", "ГМ", "Арбитр", "Рецензент", "Админ"]

export default class Visitor {
    static permissionNames: Record<PermissionValue, PermissionName> = {
        [PERMISSION.Admin]: "Админ",
        [PERMISSION.Reviewer]: "Рецензент",
        [PERMISSION.Arbiter]: "Арбитр",
        [PERMISSION.GM]: "ГМ",
        [PERMISSION.Player]: "Игрок"
    }

    static getPermissionName(permission: PermissionValue) {
        return Visitor.permissionNames[permission]
    }
    static getPermissionValueByName(name: PermissionName): PermissionValue {
        const element = Object.entries(Visitor.permissionNames).find(match => match[1] === name)
        const key = element ? element[0] : "0"
        return Number(key) as PermissionValue
    }
    protected _name = "Гость"
    protected _permission: PermissionValue = PERMISSION.Player
    async getToken() {
        return ""
    }
    get name() {
        return this._name
    }
    get email() {
        return ""
    }
    get authorized() {
        return false
    }
    get permission() {
        return this._permission
    }
    get permissionName() {
        return Visitor.getPermissionName(this._permission)
    }
    canAccess(permission: PermissionValue) {
        return this._permission >= permission
    }
}

