import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface EventReviewState {
    reviewer_profile: string,
    reviewer_discord: string,
    approved?: boolean,
    isFirstReview?: boolean,
    takeRequired?: boolean,
    reviewSummary: string
}

enum EventReviewFieldActionTypes {
    reviewer_profile = "reviewer_profile",
    reviewer_discord = "reviewer_discord"
}

enum EventReviewParameterTypes {
    approved = "approved",
    isFirstReview = "isFirstReview",
    takeRequired = "takeRequired"
}

const initialState: EventReviewState = {
    reviewer_profile: "",
    reviewer_discord: "",
    approved: undefined,
    isFirstReview: undefined,
    takeRequired: undefined,
    reviewSummary: ""
}

export const eventReviewSLice = createSlice({
    name: 'event',
    initialState,
    reducers: {
        setReviewerField: (state = initialState, action: PayloadAction<string>) => {
            switch(action.type) {
                case EventReviewFieldActionTypes.reviewer_profile:
                    state.reviewer_profile = action.payload
                    break
                case EventReviewFieldActionTypes.reviewer_discord:
                    state.reviewer_discord = action.payload
                    break
                default:
                    break
            }
        },
        setParameter: (state = initialState, action: PayloadAction<boolean>) => {
            switch(action.type) {
                case EventReviewParameterTypes.approved:
                    state.approved = action.payload
                    break
                case EventReviewParameterTypes.isFirstReview:
                    state.isFirstReview = action.payload
                    break
                case EventReviewParameterTypes.takeRequired:
                    state.takeRequired = action.payload
                    break
                default:
                    break
            }
        },
        setReview: (state = initialState, action: PayloadAction<string>) => {
            state.reviewSummary = action.payload
        }
    }
});

export const { setReview, setParameter, setReviewerField } = eventReviewSLice.actions;