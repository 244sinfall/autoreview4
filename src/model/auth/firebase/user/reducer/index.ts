import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AuthorizedUser} from "../index";

interface UserState {
    user: AuthorizedUser | null
}

const userInitialState: UserState = {
    user: null
}

export const userSlice = createSlice({name: "user", initialState: userInitialState, reducers: {
        setUser: (state, action: PayloadAction<AuthorizedUser>) => {
            if(action.payload) state.user = action.payload
        },
        removeUser: (state) => {
            state.user = null
        }
    }})

