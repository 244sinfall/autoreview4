import {configureStore} from '@reduxjs/toolkit'
import {charsheetReviewSLice} from "./charsheets/charsheet-review";
import {eventReviewSLice} from "./events/event-review";
import {userSlice} from "./auth";
// ...



export const store = configureStore({
    reducer: {
        charsheet: charsheetReviewSLice.reducer,
        event: eventReviewSLice.reducer,
        user: userSlice.reducer
        // comments: commentsReducer,
        // users: usersReducer,
    }, middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions:["user/setUser"],
            ignoredPaths:['user.user']
        }
    })

})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch