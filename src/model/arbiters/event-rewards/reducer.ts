import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import RewardDistributionDefaultState, {
    RewardDistributionMode,
    RewardDistributionModeValue,
    RewardDistributionResponse
} from "./types";
// import {createAppAsyncThunk} from "../../../services/services/store";
import {APIResponseKnownError} from "../../exceptions";
import {createAppAsyncThunk} from "../../reduxTypes";

export const requestEventRewardDistribution = createAppAsyncThunk("event-rewards/fetch", async(_, thunkAPI) => {
    function isValidResponse(data: unknown): data is RewardDistributionResponse {
        return typeof data === "object" && data !== null && "command" in data && "participantsModified" in data
    }
    const state = thunkAPI.getState().eventReward
    if(!state.eventLink || !state.participantsCleanedText) return thunkAPI.rejectWithValue(new Error("Не заполнены поля"))
    if(!state.mode) return thunkAPI.rejectWithValue(new Error("Не выбран режим"))
    if(!state.rate) return thunkAPI.rejectWithValue(new Error("Награда не положена"))
    const mode = state.mode
    const body = JSON.stringify({...state, error: undefined, mode: RewardDistributionModeValue[mode]}) // Только то, что отправляется на сервер
    try {
        const response = await thunkAPI.extra.get("API").createRequest("arbiters.rewardWork", "", body)
        const json = await response.json()
        if(!isValidResponse(json)) thunkAPI.rejectWithValue(new Error("Некорректный ответ от сервера"))
        let result = json.commands
        if (json.participantsModified) {
            result += "\n\nОшибки и внесенные изменения:\n" + json.participantsModified
        }
        return result
    } catch (e: unknown) {
        if (e instanceof APIResponseKnownError) {
            const json = await e.response.json()
            thunkAPI.rejectWithValue("error" in json ? json.error : e.response.statusText)
        }
    }
})


const eventRewardSlice = createSlice({
    name: "event-rewards",
    initialState: RewardDistributionDefaultState,
    reducers: {
        setEventLink: (state, action: PayloadAction<string>) => {
            state.eventLink = action.payload
        },
        setEventRate: (state, action: PayloadAction<number>) => {
            state.rate = action.payload
        },
        setDistributionMode: (state, action: PayloadAction<RewardDistributionMode>) => {
            state.mode = action.payload
        },
        setParticipantsText: (state, action: PayloadAction<string>) => {
            state.participantsCleanedText = action.payload
        },
        setResult: (state, action: PayloadAction<string>) => {
            state.result = action.payload
        }
    },
    extraReducers: builder => {
        builder
            .addCase(requestEventRewardDistribution.fulfilled, (state, action) => {
                state.result = action.payload
            })
            .addCase(requestEventRewardDistribution.rejected, (state, action) => {
                if(action.payload instanceof Error) {
                    state.error = action.payload.message
                }
                if(typeof action.payload === "string") {
                    state.error = action.payload
                }
                setTimeout(() => state.error = "", 1500)
            })


    }
})

export default eventRewardSlice.reducer

export const {setEventLink, setEventRate, setDistributionMode, setParticipantsText, setResult} = eventRewardSlice.actions