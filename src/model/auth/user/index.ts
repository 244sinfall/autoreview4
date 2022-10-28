export enum Permission {
    player ,
    gm,
    arbiter,
    reviewer,
    admin,
}

export default class Visitor {
    static permissionNames = {
        [Permission.admin]: "Админ",
        [Permission.reviewer]: "Рецензент",
        [Permission.arbiter]: "Арбитр",
        [Permission.gm]: "ГМ",
        [Permission.player]: "Игрок"
    }
    static getPermissionName(permission: Permission) {
        return Visitor.permissionNames[permission]
    }
    static getPermissionValue(name: string) {
        const element = Object.entries(Visitor.permissionNames).find(match => match[1] === name)
        const key = element ? element[0] : "0"
        return Number(key)
    }
    protected _name = "Гость"
    protected _permission: Permission = Permission.player
    get name() {
        return this._name
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
    canAccess(permission: Permission) {
        return this._permission >= permission
    }
    isLoaded() {
        return true
    }
}

