import {createAppAsyncThunk} from "../reduxTypes";
import {GameObject, GameObjectTypeFilter} from "./types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import initialState from './types'

export const fetchGameObjects = createAppAsyncThunk("gob-searcher/fetch", async(_, thunkAPI) => {
    function isError(data: unknown): data is { error: string } {
        return typeof data === "object" && data !== null && "error" in data
    }
    function hasResult(data: unknown): data is { result: GameObject[] } {
        if(typeof data === "object" && data !== null && "result" in data) {
            return Array.isArray(data.result) && data.result.length !== 0 &&
                typeof data.result[0] === "object" && data.result[0] !== null && "id" in data.result[0] && "name" in data.result[0] && "type" in data.result[0]
        }
        return false
    }
    const data = await thunkAPI.extra.get("API").createRequest("gobs.get")
    const response = await data.json()
    if(isError(response)) return thunkAPI.rejectWithValue(new Error(response.error))
    if(!hasResult(response)) return thunkAPI.rejectWithValue(new Error("Неизвестный формат данных"))
    return response.result
})

const GobSearcherSlice = createSlice({
    name: "gob-searcher",
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload
            state.page = 1
        },
        setType: (state, action: PayloadAction<GameObjectTypeFilter>) => {
            state.typeFilter = action.payload
            state.page = 1
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchGameObjects.pending, state => {
                state.isLoading = true
            })
            .addCase(fetchGameObjects.fulfilled, (state, action) => {
                state.items = action.payload
                state.isLoading = false
            })
            .addCase(fetchGameObjects.rejected, (state, action) => {
                if(action.payload instanceof Error) {
                    state.error = action.payload.message
                } else {
                    state.error = "Произошла ошибка при получении данных"
                }
                state.isLoading = false
            })
    }
})

export default GobSearcherSlice.reducer

export const { setSearch, setType, setPage } = GobSearcherSlice.actions