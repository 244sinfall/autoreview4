import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import CharsheetReviewTemplate, {Rate} from "../index";

export const charsheetReviewSLice = createSlice({
    name: 'charsheet',
    initialState: CharsheetReviewTemplate.defaultState,
    reducers: {
        setRates: (state, action: PayloadAction<Rate[]>) => {
            state.rates = action.payload
        },
        updateRates: (state, action: PayloadAction<Rate>) => {
            let foundRate = state.rates.findIndex((rate) => rate.rateName === action.payload.rateName);
            foundRate === -1 ? state.rates.push(action.payload) :
                state.rates[foundRate] = action.payload
        },
        setCharName: (state, action: PayloadAction<string>) => {
            state.charName = action.payload
        },
        setReviewerProfile: (state, action: PayloadAction<string>) => {
            state.reviewerProfile = action.payload
        },
        setReviewerDiscord: (state, action: PayloadAction<string>) => {
            state.reviewerDiscord = action.payload
        }
    }
});

export const { setRates, updateRates, setCharName, setReviewerProfile, setReviewerDiscord } = charsheetReviewSLice.actions;