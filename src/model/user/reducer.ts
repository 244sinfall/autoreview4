import {
    createAsyncThunk,
    createSlice,
    PayloadAction
} from "@reduxjs/toolkit";
import {PERMISSION, PermissionValue} from "./index";
import Authorizer, {UserLoginCredentials, UserRegisterCredentials} from "../auth/authorizer";
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
export const createSession = createAsyncThunk("user/createSession",
    async(params: {cred: UserLoginCredentials | UserRegisterCredentials, formState: "reg" | "auth"}) => {
    const authorizer = new Authorizer();
    const user = "passwordCheck" in params.cred && params.formState === "reg"
        ? await authorizer.signup(params.cred) : await authorizer.login(params.cred)
        const document = await getDoc(doc(db, 'permissions', user.uid))
        const data = document.data()
        function isPermission (receivedNumber: number) {
            return receivedNumber >= PERMISSION.Player && receivedNumber <= PERMISSION.Admin
        }

        if(data && "permission" in data && isPermission(data.permission))
            return {name: user.displayName ?? "Пользователь", email: user.email ?? "",
                permission: data?.permission as PermissionValue}
        return {name: user.displayName ?? "Пользователь", email: user.email ?? "",
            permission: 0 as PermissionValue}
})

export const restoreSession = createAsyncThunk("user/restoreSession", async(user: User) => {
    const document = await getDoc(doc(db, 'permissions', user.uid))
    const data = document.data()
    function isPermission (receivedNumber: number) {
        return receivedNumber >= PERMISSION.Player && receivedNumber <= PERMISSION.Admin
    }

    if(data && "permission" in data && isPermission(data.permission))
        return {name: user.displayName ?? "Пользователь", email: user.email ?? "",
            permission: data.permission as PermissionValue}
    return {name: user.displayName ?? "Пользователь", email: user.email ?? "",
        permission: 0 as PermissionValue}
})

export const destroySession = createAsyncThunk("user/destroySession", async() => {
    await signOut(auth)
})

export const userSlice = createSlice({name: "user", initialState: userInitialState,
    reducers: {},
    extraReducers: builder => builder
        .addCase(destroySession.fulfilled, state => {
            state.user = DefaultUserState
            localStorage.removeItem("hasFirebaseSession")
        })
        .addCase(restoreSession.pending, state => {state.isLoading = true})
        .addCase(restoreSession.fulfilled, (state, action: PayloadAction<UserStateUserInfo>) => {
            state.user = action.payload
            localStorage.setItem("hasFirebaseSession", "true")
            state.isLoading = false
        })
        .addCase(restoreSession.rejected, (state) => {
            state.isLoading = false
        })
        .addCase(createSession.fulfilled, (state, action: PayloadAction<UserStateUserInfo>) => {
            state.user = action.payload
            localStorage.setItem("hasFirebaseSession", "true")
            state.isLoading = false
        })
        .addCase(createSession.rejected, (state) => {
            state.isLoading = false
        })
})