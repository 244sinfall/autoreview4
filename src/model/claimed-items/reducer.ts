import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ClaimedItemInterface, ClaimedItemsTables, DefaultClaimedItemPages, DefaultClaimedItemState} from "./types";
import {APIConfig} from "../../config/api";

export const updateClaimedItemsContent = createAsyncThunk("claimedItems/fetchItems",
    async () => {
        const res = await fetch(`${APIConfig.address}${APIConfig.endpoints.claimedItems.get}`)
        const json = await res.json()
        if("error" in json) throw new Error(json.error)
        if("result" in json) return json.result as ClaimedItemsTables
        throw new Error("Некорректный ответ от сервера")
    })
export const claimedItemsSlice = createSlice({
    name: 'claimedItems',
    initialState: DefaultClaimedItemState,
    reducers: {
        setAddModal: (state, action: PayloadAction<keyof ClaimedItemsTables>) => {
            state.addModal = action.payload
        },
        removeAddModal: (state) => {
            state.addModal = null
        },
        setEditModal: (state, action: PayloadAction<ClaimedItemInterface>) => {
            state.editModal = action.payload
        },
        removeEditModal: (state) => {
            state.editModal = null
        },
        setPage: (state, action: PayloadAction<{ key: keyof ClaimedItemsTables, page: number }>) => {
            state.page[action.payload.key] = action.payload.page
        },
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload
            state.page = DefaultClaimedItemPages
        },
        setError: (state, action: PayloadAction<Error>) => {
            state.error = action.payload.message
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateClaimedItemsContent.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateClaimedItemsContent.fulfilled, (state, action: PayloadAction<ClaimedItemsTables>) => {
                state.content = action.payload
                state.isLoading = false
                state.page = DefaultClaimedItemPages
            })
            .addCase(updateClaimedItemsContent.rejected, (state, action) => {
                if(action.payload instanceof Error) {
                    state.error = action.payload.message
                }
                state.isLoading = false
            })
    }
});

export const { setAddModal, removeAddModal, setEditModal, removeEditModal, setError, setPage, setSearch } = claimedItemsSlice.actions;