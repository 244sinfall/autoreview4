import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    ClaimedItemInterface,
    ClaimedItemMinimal,
    ClaimedItemsTables,
    DefaultClaimedItemPages,
    DefaultClaimedItemState
} from "./types";
import {createAppAsyncThunk} from "../reduxTypes";
import {APIResponseKnownError, StructureException} from "../exceptions";

const getClaimedItemsContent = createAppAsyncThunk("claimedItems/fetch", async(_, thunkAPI) => {
    try {
        function isResponse(data: unknown): data is { result: ClaimedItemsTables } {
            return typeof data === "object" && data !== null && "result" in data
        }
        const response = await thunkAPI.extra.get("API").createRequest("claimedItems.get")
        const json = await response.json()
        if(isResponse(json)) return json.result
        return thunkAPI.rejectWithValue(new StructureException("Некорретная структура данных"))
    } catch (e: unknown) {
        if (e instanceof APIResponseKnownError) {
            return thunkAPI.rejectWithValue(e)
        }
        throw e
    }
})

const addClaimedItem = createAppAsyncThunk("claimedItems/add", async(item: Partial<ClaimedItemMinimal>, thunkAPI) => {
    try {
        const merged = Object.assign({
            accepted: false,
            acceptedAt: new Date(),
            acceptor: "",
            addedAt: new Date(),
            additionalInfo: "",
            id: "",
            link: "",
            name: "",
            owner: "",
            ownerProfile: "",
            ownerProof: "",
            ownerProofLink: "",
            quality: "",
            reviewer: "",
        }, item)
        await thunkAPI.extra.get("API").createRequest("claimedItems.create", "", JSON.stringify({...merged}))
        return merged
    } catch (e: unknown) {
        if(e instanceof APIResponseKnownError) {
            return thunkAPI.rejectWithValue(e)
        }
        throw e
    }
})

const updateClaimedItem = createAppAsyncThunk("claimedItems/update", async(changes: ClaimedItemInterface, thunkAPI) => {
    try {
        await thunkAPI.extra.get("API").createRequest("claimedItems.update", `/${changes.id}`, JSON.stringify(changes))
        return changes
    } catch (e: unknown) {
        if(e instanceof APIResponseKnownError) {
            return thunkAPI.rejectWithValue(e)
        }
        throw e
    }
})

const approveClaimedItem = createAppAsyncThunk("claimedItems/approve", async(id: string, thunkAPI) => {
    try {
        await thunkAPI.extra.get("API").createRequest("claimedItems.approve", `/${id}`)
        return id
    } catch (e: unknown) {
        if(e instanceof APIResponseKnownError) {
            return thunkAPI.rejectWithValue(e)
        }
        throw e
    }
})

const removeClaimedItem = createAppAsyncThunk("claimedItems/remove", async(id: string, thunkAPI) => {
    try {
        await thunkAPI.extra.get("API").createRequest("claimedItems.delete", `/${id}`)
        return id
    } catch (e: unknown) {
        if(e instanceof APIResponseKnownError) {
            return thunkAPI.rejectWithValue(e)
        }
        throw e
    }
})

export const claimedItemsAsyncActions = { getClaimedItemsContent, addClaimedItem, updateClaimedItem, approveClaimedItem, removeClaimedItem }
const claimedItemsSlice = createSlice({
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
            .addCase(getClaimedItemsContent.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getClaimedItemsContent.fulfilled, (state, action: PayloadAction<ClaimedItemsTables>) => {
                state.content = action.payload
                state.isLoading = false
                state.page = DefaultClaimedItemPages
            })
            .addCase(getClaimedItemsContent.rejected, (state, action) => {
                if(action.payload instanceof APIResponseKnownError) {
                    state.error = action.payload.message
                }
                state.isLoading = false
            })
            .addCase(addClaimedItem.rejected, (state, action) => {
                if(action.payload instanceof APIResponseKnownError) {
                    state.error = action.payload.message
                }
                state.isLoading = false
            })
            .addCase(addClaimedItem.fulfilled, (state) => {
                state.addModal = null
            })
            .addCase(updateClaimedItem.rejected, (state, action) => {
                if(action.payload instanceof APIResponseKnownError) {
                    state.error = action.payload.message
                }
            })
            .addCase(updateClaimedItem.fulfilled, (state) => {
                state.editModal = null
            })
            .addCase(approveClaimedItem.rejected, (state, action) => {
                if(action.payload instanceof APIResponseKnownError) {
                    state.error = action.payload.message
                }
                state.editModal = null
            })
            .addCase(approveClaimedItem.fulfilled, (state) => {
                state.editModal = null
            })
            .addCase(removeClaimedItem.rejected, (state, action) => {
                if(action.payload instanceof APIResponseKnownError) {
                    state.error = action.payload.message
                }
                state.editModal = null
            })
            .addCase(removeClaimedItem.fulfilled, (state) => {
                state.editModal = null
            })
    }
});

export const { setAddModal, removeAddModal, setEditModal, removeEditModal, setPage, setSearch } = claimedItemsSlice.actions;

export default claimedItemsSlice.reducer