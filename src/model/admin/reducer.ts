import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import AdminReducerDefaultState, {AdminReducerPermissionFilter} from "./types";
import {FirestoreUserData, PermissionName, PermissionValueByName} from "../user";
import {FirestoreDataException, NoAccessException} from "../exceptions";
import {createAppAsyncThunk} from "../reduxTypes";

export const fetchAdminUserList = createAppAsyncThunk("admin/fetchUsers", async (_, thunkAPI) => {
    const controller = thunkAPI.extra.get("UserController").getInstance()
    if(!controller.is("Admin")) return thunkAPI.rejectWithValue(new NoAccessException("Недостаточно прав"))
    return await controller.getAllUsers()
})
export const setUserPermission = createAppAsyncThunk("admin/setUserPermission",
    async (params: { user: FirestoreUserData, newPermission: PermissionName },
           thunkAPI) => {
    const permission = PermissionValueByName[params.newPermission];
    try {
        const controller = thunkAPI.extra.get("UserController").getInstance()
        if(!controller.is("Admin")) return thunkAPI.rejectWithValue(new NoAccessException("Недостаточно прав"))
        await controller.changeRole(params.user.email, permission)
        return { ...params.user, permission: permission }
    } catch (e: unknown) {
        if(e instanceof FirestoreDataException) {
            return thunkAPI.rejectWithValue(e);
        }
        throw e
    }
})

const adminSlice = createSlice({
    name: 'admin',
    initialState: AdminReducerDefaultState,
    reducers: {
        setSelectedUser: (state, action: PayloadAction<FirestoreUserData>) => {
            state.selectedUser = action.payload
        },
        removeSelectedUser: (state) => {
            state.selectedUser = null
        },
        setPermissionFilter: (state, action: PayloadAction<AdminReducerPermissionFilter>) => {
            state.filter.permission = action.payload
        },
        setSearchFilter: (state, action: PayloadAction<string>) => {
            state.filter.search = action.payload
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminUserList.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchAdminUserList.fulfilled, (state, action: PayloadAction<FirestoreUserData[]>) => {
                state.users = action.payload
                state.isLoading = false
            })
            .addCase(fetchAdminUserList.rejected, (state, action) => {
                if(action.payload instanceof Error) {
                    state.error = action.payload.message
                }
                state.isLoading = false
            })
            .addCase(setUserPermission.rejected, (state, action) => {
                if(action.payload instanceof Error && state.selectedUser) {
                    state.selectedUser.error = action.payload.message
                }
            })
            .addCase(setUserPermission.fulfilled, (state, action: PayloadAction<FirestoreUserData>) => {
                const user = state.users.findIndex(user => user.name === action.payload.name &&
                    user.email === action.payload.email)
                if(user === -1 && state.selectedUser) {
                    state.selectedUser.error = "Пользователь не найден в исходном списке"
                    return
                }
                state.users[user] = action.payload
                if(state.selectedUser) state.selectedUser = action.payload
            })
    }
});

export const { setSelectedUser, removeSelectedUser, setPermissionFilter, setSearchFilter, setPage } = adminSlice.actions

export default adminSlice.reducer