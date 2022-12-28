import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Theme} from "./types";
const initialTheme = () => {
    let theme: Theme = localStorage.getItem("theme") as Theme;
    if(!theme || !["darkmoon", "light", "dark"].includes(theme)) {
        theme = "darkmoon";
        localStorage.setItem('theme', 'darkmoon')
    }
    return theme;
}
export const themeSlice = createSlice({
    name: 'theme',
    initialState: {selected: initialTheme()},
    reducers: {
        changeTheme: (state, action: PayloadAction<Theme>) => {
            state.selected = action.payload;
            localStorage.setItem('theme', action.payload);
        }
    }
});

export const { changeTheme } = themeSlice.actions;