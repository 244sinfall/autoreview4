import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import CharsheetReviewTemplate, {Rate} from "../index";

export const charsheetReviewSLice = createSlice({
    name: 'charsheet',
    initialState: CharsheetReviewTemplate.defaultState,
    reducers: {
        updateRates: (state, action: PayloadAction<Rate>) => {
            const newRates = [...state.rates]
            const index = newRates.findIndex(rate => rate.rateName === action.payload.rateName)
            if(index === -1) return
            newRates[index] = action.payload;
            state.rates = newRates;
            state.totalRate = Math.floor(state.rates.reduce((acc, curr) => acc + curr.rateValue, 0) / state.rates.length)
        },
        setCharName: (state, action: PayloadAction<string>) => {
            state.charName = action.payload
        },
        setReviewerProfile: (state, action: PayloadAction<string>) => {
            state.reviewerProfile = action.payload
            localStorage.setItem("profileLink", action.payload)
        },
        setReviewerDiscord: (state, action: PayloadAction<string>) => {
            state.reviewerDiscord = action.payload
            localStorage.setItem("discordProfile", action.payload)
        }
    }
});

export const { updateRates, setCharName, setReviewerProfile, setReviewerDiscord } = charsheetReviewSLice.actions;