import { configureStore } from '@reduxjs/toolkit'
import {charsheetReviewSLice} from "./charsheets/charsheetReview";
import {eventReviewSLice} from "./events/eventReview";
// ...



export const store = configureStore({
    reducer: {
        charsheet: charsheetReviewSLice.reducer,
        event: eventReviewSLice.reducer
        // comments: commentsReducer,
        // users: usersReducer,
    },

})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch