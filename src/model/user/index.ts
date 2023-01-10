export const PERMISSION = {
    Player: 0,
    GM: 1,
    Arbiter: 2,
    Reviewer: 3,
    Admin: 4
} as const

export type PermissionTitle = keyof typeof PERMISSION;

export type PermissionValue = typeof PERMISSION[PermissionTitle]

export type PermissionName = "Игрок" | "ГМ" | "Арбитр" | "Рецензент" | "Админ"

export const PermissionNameByValue: Record<PermissionValue, PermissionName> = {
    [PERMISSION.Admin]: "Админ",
    [PERMISSION.Reviewer]: "Рецензент",
    [PERMISSION.Arbiter]: "Арбитр",
    [PERMISSION.GM]: "ГМ",
    [PERMISSION.Player]: "Игрок"
}

export const PermissionTitleByValue: Record<PermissionValue, PermissionTitle> = {
    [PERMISSION.Admin]: "Admin",
    [PERMISSION.Reviewer]: "Reviewer",
    [PERMISSION.Arbiter]: "Arbiter",
    [PERMISSION.GM]: "GM",
    [PERMISSION.Player]: "Player"
}

export const PermissionValueByName: Record<PermissionName, PermissionValue> = {
    "Админ": 4,
    "Рецензент": 3,
    "Арбитр": 2,
    "ГМ": 1,
    "Игрок": 0
}

/**
 * Схема хранения данных о пользователе в Cloud Firestore
 */
export type FirestoreUserData = {
    name: string,
    permission: PermissionValue,
    email: string
}

export const PermissionNames: PermissionName[] = ["Игрок", "ГМ", "Арбитр", "Рецензент", "Админ"]