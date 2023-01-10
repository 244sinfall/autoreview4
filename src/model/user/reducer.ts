import {
    createAsyncThunk,
    createSlice,
    PayloadAction
} from "@reduxjs/toolkit";
import {PERMISSION, PermissionValue} from "./index";
import {signOut, User} from "firebase/auth";
import {auth, db} from "../auth/global";
import {doc, getDoc} from "firebase/firestore";

export type UserStateUserInfo = {
    name: string,
    email: string,
    permission: PermissionValue
}

export const DefaultUserState = {
    name: "Гость",
    email: "",
    permission: PERMISSION.Player
}

interface UserState {
    user: UserStateUserInfo
    isLoading: boolean
}

const userInitialState: UserState = {
    user: DefaultUserState,
    isLoading: !!localStorage.getItem("hasFirebaseSession")
}

export const restoreSession = createAsyncThunk("user/restoreSession", async(user: User) => {
    const document = await getDoc(doc(db, 'permissions', user.uid))
    const data = document.data()
    function isPermission (receivedNumber: number) {
        return receivedNumber >= PERMISSION.Player && receivedNumber <= PERMISSION.Admin
    }
    let permission: PermissionValue = 0
    if(data && "permission" in data && isPermission(data.permission))
        permission = data.permission;
    localStorage.setItem("hasFirebaseSession", "true")
    return {name: user.displayName ?? "Пользователь", email: user.email ?? "",
        permission:permission}
})

export const destroySession = createAsyncThunk("user/destroySession", async() => {
    await signOut(auth)
    localStorage.removeItem("hasFirebaseSession")
})

export const userSlice = createSlice({name: "user", initialState: userInitialState,
    reducers: {},
    extraReducers: builder => builder
        .addCase(destroySession.fulfilled, state => {
            state.user = DefaultUserState
        })
        .addCase(restoreSession.pending, state => {state.isLoading = true})
        .addCase(restoreSession.fulfilled, (state, action: PayloadAction<UserStateUserInfo>) => {
            state.user = action.payload
            state.isLoading = false
        })
        .addCase(restoreSession.rejected, (state) => {
            state.isLoading = false
        })
})