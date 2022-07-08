import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {APIAddress, getCharsheetEndPoint} from "../../config/api";

export interface Rate {
    rateName: string,
    rateValue: number
}

interface Field {
    fieldName: string,
    fieldValue: string
}

export interface CharsheetReviewState {
    rates: Rate[],
    totalRate: number,
    fields: Field[]
}

const initialState: CharsheetReviewState = {
    rates: [],
    fields: [
        { fieldName: "char_name", fieldValue: "" },
        { fieldName: "reviewer_profile", fieldValue: "" },
        { fieldName: "reviewer_discord", fieldValue: "" }
    ],
    totalRate: 0
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
        setRates: (state, action: PayloadAction<Rate[]>) => {
            state.rates = action.payload
            state.totalRate = getTotalRate(action.payload)
        },
        updateFields: (state, action: PayloadAction<Field>) => {
            let foundField = state.fields.findIndex((field) => field.fieldName === action.payload.fieldName);

            foundField === -1 ? state.fields.push({
                fieldName: action.payload.fieldName,
                fieldValue: action.payload.fieldValue
            }) : state.fields[foundField].fieldValue = action.payload.fieldValue;

        }
    }
});

function getTotalRate(rates: Rate[]) {
    let totalRate = 0;
    rates.forEach((value) => totalRate += value.rateValue)
    return Math.floor(totalRate/rates.length)
}


function getRequestBody(charsheetState: CharsheetReviewState) {
    let ratesAPIFormat: Object[] = []
    let char_name, reviewer_profile, reviewer_discord = ''
    charsheetState.rates.forEach((rate) => ratesAPIFormat.push({'rate_name': rate.rateName, 'rate_value': rate.rateValue}))
    charsheetState.fields.forEach((field) => {
        if(field.fieldName === 'char_name') {
            char_name = field.fieldValue
        }
        if(field.fieldName === 'reviewer_profile') {
            reviewer_profile = field.fieldValue
        }
        if(field.fieldName === 'reviewer_discord') {
            reviewer_discord = field.fieldValue
        }

    })
    const returnObject = {
        "rates": ratesAPIFormat,
        "total_rate": charsheetState.totalRate,
        "char_name": char_name,
        "reviewer_profile": reviewer_profile,
        "reviewer_discord": reviewer_discord
    }
    return returnObject
}


export async function getReview(charsheetState: CharsheetReviewState): Promise<string> {
    return await fetch(APIAddress + getCharsheetEndPoint, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": 'application/json',
        },
        body: JSON.stringify(getRequestBody(charsheetState))
    })
        .then((response) => response.json())
        .then((data) => {
            if ('review' in data) {
                return data['review'];
            }
        })
        .catch(() => {
            return 'Не удалось получить вердикт';
        })
        .finally(() => {
            return 'Не удалось получить вердикт';
        });
}

export const { updateRates, setRates, updateFields } = charsheetReviewSLice.actions;

