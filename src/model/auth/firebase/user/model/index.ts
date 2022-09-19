export interface UserInfo {
    name: string,
    password: string,
    passwordCheck: string,
    email: string,
}

export enum AuthFields {
    name = "Ник на Darkmoon",
    password = "Пароль",
    passwordCheck = "Еще раз пароль",
    email= "E-mail",
}

export enum Permission {
    player ,
    gm,
    arbiter,
    reviewer,
    admin,
}

export function getPermissionName(permission: Permission | null) {
    switch (permission) {
        case Permission.admin:
            return "Админ"
        case Permission.reviewer:
            return "Рецензент"
        case Permission.arbiter:
            return "Арбитр"
        case Permission.gm:
            return "ГМ"
        case Permission.player:
            return "Игрок"
        default:
            return "Не найдено"
    }
}

export function getPermissionValue(permission: string) {
    switch (permission) {
        case "Админ": return 4
        case "Рецензент": return 3
        case "Арбитр": return 2
        case "ГМ": return 1
        case "Игрок": return 0
        default: return 0
    }
}