import {createAppAsyncThunk} from "../reduxTypes";
import {GameObject, GameObjectType, GameObjectTypeFilter} from "./types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import initialState from './types'

export const fetchGameObjects = createAppAsyncThunk("gob-searcher/fetch", async() => {
    const data = await fetch('gobs.csv');
    const response = await data.text()
    const splittedResponse = response.split("\n")
    const records: GameObject[] = []
    let count = 0;
    for(const line of splittedResponse) {
        if(count !== 0 && count % 5000 === 0) setTimeout(() => {})
        const record = line.split(",")
        if(record.length !== 3) {
            records.push({id: 0, name: "", type: 0 as GameObjectType})
            continue
        }
        const id = parseInt(record[0])
        if (isNaN(id)) {
            records.push({id: 0, name: "", type: 0 as GameObjectType})
            continue
        }
        const type = parseInt(record[2])
        if (isNaN(type) && (type < 0 || type > 2)) {
            records.push({id: 0, name: "", type: 0 as GameObjectType})
            continue
        }
        const okType = type as GameObjectType
        records.push({id, name: String(record[1] ?? ""), type: okType})
        count++
    }
    return records
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