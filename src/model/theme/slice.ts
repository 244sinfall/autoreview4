import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Theme} from "./types";
const initialTheme = () => {
    let theme: Theme = localStorage.getItem("theme") as Theme;
    if(!theme || !["darkmoon", "light", "dark"].includes(theme)) {
        theme = "darkmoon";
        localStorage.setItem('theme', 'darkmoon')
    }
    switchColorTheme(theme);
    return theme;
}

export const colorThemeColors = {
    "darkmoon": "#5B3E5D",
    "light": "#D5D5D5",
    "dark": "#1E1E1E"
} as Record<Theme, string>

const switchColorTheme = (theme: Theme) => {
    document.body.classList.add(theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", colorThemeColors[theme])
}
export const themeSlice = createSlice({
    name: 'theme',
    initialState: {selected: initialTheme()},
    reducers: {
        changeTheme: (state, action: PayloadAction<Theme>) => {
            state.selected = action.payload;
            localStorage.setItem('theme', action.payload);
            switchColorTheme(action.payload);
        }
    }
});

export const { changeTheme } = themeSlice.actions;