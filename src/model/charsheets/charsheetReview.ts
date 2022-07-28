import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {APIAddress, getCharsheetEndPoint} from "../../config/api";

export interface Rate {
    rateName: string,
    rateValue: number
}

export interface CharsheetReviewState {
    rates: Rate[],
    totalRate: number,
    charName: string,
    reviewerProfile: string,
    reviewerDiscord: string
}

const initialState: CharsheetReviewState = {
    rates: [],
    totalRate: 0,
    charName: "",
    reviewerProfile: "",
    reviewerDiscord: ""
}

export const charsheetReviewSLice = createSlice({
    name: 'charsheet',
    initialState,
    reducers: {
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


export async function getReview(charsheetState: CharsheetReviewState): Promise<string> {
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
            if ('review' in data) {
                return data['review'];
            }
            else {
                throw Error('Сервер вернул неверные данные.')
            }

        })
        .catch(() => {
            return 'Не удалось получить вердикт';
        })
}

export const { updateRates, setCharName, setReviewerProfile, setReviewerDiscord } = charsheetReviewSLice.actions;

