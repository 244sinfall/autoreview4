import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import Visitor from "../index";
import AuthorizedUser from "../authorized-user";

interface UserState {
    user: Visitor
}

const userInitialState: UserState = {
    user: new Visitor()
}

export const userSlice = createSlice({name: "user", initialState: userInitialState, reducers: {
        setUser: (state, action: PayloadAction<AuthorizedUser>) => {
            if(action.payload) state.user = action.payload
        },
        removeUser: (state) => {
            state.user = new Visitor()
        }
    }})

export const { setUser, removeUser } = userSlice.actions;