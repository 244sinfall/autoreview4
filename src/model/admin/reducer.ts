import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import AdminController from "../auth/controllers/admin-controller";
import AdminReducerDefaultState, {AdminReducerPermissionFilter} from "./types";
import {AdminUserData} from "../auth/controllers/admin-controller/types";
import Visitor, {PermissionName} from "../auth/user";

export const fetchAdminUserList = createAsyncThunk("admin/fetchUsers", async (controller: AdminController) => {
    return await controller.getAllUsers()
})
export const setUserPermission = createAsyncThunk("admin/setUserPermission",
    async (params: {controller: AdminController, user: AdminUserData, newPermission: PermissionName}) => {
    const permission = Visitor.getPermissionValueByName(params.newPermission)
    await params.controller.changeRole(params.user.email, permission)
    return {...params.user, permission: permission}
})

const adminSlice = createSlice({
    name: 'admin',
    initialState: AdminReducerDefaultState,
    reducers: {
        setSelectedUser: (state, action: PayloadAction<AdminUserData>) => {
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
            .addCase(fetchAdminUserList.fulfilled, (state, action: PayloadAction<AdminUserData[]>) => {
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
            .addCase(setUserPermission.fulfilled, (state, action: PayloadAction<AdminUserData>) => {
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