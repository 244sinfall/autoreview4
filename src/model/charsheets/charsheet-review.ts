import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {APIAddress, getCharsheetEndPoint} from "../../config/api";

export interface Rate {
    rateName: string,
    rateValue: number
}

export interface CharsheetReviewRequest {
    rates: Rate[],
    totalRate: number,
    charName: string,
    reviewerProfile: string,
    reviewerDiscord: string
}

const initialState: CharsheetReviewRequest = {
    rates: [],
    totalRate: 0,
    charName: "",
    reviewerProfile: "",
    reviewerDiscord: ""
}

export interface CharsheetReviewResponse {
    review: string
}

export enum ReviewFields {
    charName = "Ник проверяемого персонажа",
    reviewerProfile = "Ссылка на профиль",
    reviewerDiscord = "Discord"
}

export enum ReviewButtonTypes {
    createReviewTitle = "Создать вердикт",
    copyReviewTitle = "Скопировать вердикт"
}

export const charsheetReviewSLice = createSlice({
    name: 'charsheet',
    initialState,
    reducers: {
        setRates: (state, action: PayloadAction<Rate[]>) => {
            state.rates = action.payload
            state.totalRate = getTotalRate(action.payload)
        },
        updateRates: (state= initialState, action: PayloadAction<Rate>) => {

            let foundRate = state.rates.findIndex((rate) => rate.rateName === action.payload.rateName);
            foundRate === -1 ? state.rates.push(action.payload) :
                        state.rates[foundRate] = action.payload
            state.totalRate = getTotalRate(state.rates)
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

function getTotalRate(rates: Rate[]) {
    let totalRate = 0;
    rates.forEach((value) => totalRate += value.rateValue)
    return Math.floor(totalRate/rates.length)
}

export function isFieldsFilled(charsheetScheme: CharsheetReviewRequest) {
    return charsheetScheme.charName !== "" && charsheetScheme.reviewerDiscord !== "" &&
        charsheetScheme.reviewerProfile !== ""
}

export async function getReview(charsheetState: CharsheetReviewRequest) {
    return await fetch(APIAddress + getCharsheetEndPoint, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": 'application/json',
        },
        body: JSON.stringify(charsheetState)
    })
        .then((response) => response.json())
        .then((data) => {
            if(!data['error'])
                return data as CharsheetReviewResponse
            throw Error('Ошибка в запросе')
        })

}

export const { setRates, updateRates, setCharName, setReviewerProfile, setReviewerDiscord } = charsheetReviewSLice.actions;

