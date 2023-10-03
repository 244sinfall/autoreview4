import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import ArbiterItemsDefaultState from "./types";

const arbiterItemsSliceSlice = createSlice({
    name: "arbiter-items",
    initialState: ArbiterItemsDefaultState,
    reducers: {
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload
            state.page = 1;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload
        },
        setPerPage: (state, action: PayloadAction<number>) => {
            state.perPage = action.payload
            state.page = 1
        }
    },
})

export default arbiterItemsSliceSlice.reducer

export const { setSearch, setPage, setPerPage } = arbiterItemsSliceSlice.actions