import {configureStore} from '@reduxjs/toolkit'
import {eventReviewSLice} from "./events/event-review";
import {userSlice} from "./auth/user/reducer";
import {charsheetReviewSLice} from "./charsheets/reducer";
import {themeSlice} from "./theme/slice";
import {claimedItemsSlice} from "./claimed-items/reducer";


export const store = configureStore({
    reducer: {
        charsheet: charsheetReviewSLice.reducer,
        event: eventReviewSLice.reducer,
        user: userSlice.reducer,
        theme: themeSlice.reducer,
        claimedItems: claimedItemsSlice.reducer
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