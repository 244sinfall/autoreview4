import {HeaderMenuElement} from "./model/header-menu-element";
import {Permission} from "./model/auth/user";

const changeTheme = (theme: string) => {
    const currentTheme = localStorage.getItem("theme")
    currentTheme === null ? document.body.classList.add(theme) : document.body.classList.replace(currentTheme, theme)
    localStorage.setItem("theme", theme)
}

export const createThemes = (onBack: () => void): HeaderMenuElement[] => {
    const change = (theme: string) => {
        changeTheme(theme)
        onBack()
    }
    return [
        {menuName: "Darkmoon", accessLevel: Permission.player, action: () => change("darkmoon")},
        {menuName: "Светлая", accessLevel: Permission.player, action: () => change("light")},
        {menuName: "Темная", accessLevel: Permission.player, action: () => change("dark")},
        {menuName: "Назад", accessLevel: Permission.player, action: onBack}
    ]
}

export const initTheme = () => {
    let theme = localStorage.getItem("theme")
    if(theme === null) {
        theme = "darkmoon"
        localStorage.setItem("theme", "darkmoon")
    }
    document.body.classList.add(theme)
}