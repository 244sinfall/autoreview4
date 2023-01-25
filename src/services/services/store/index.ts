import Service from "../service";
import {configureStore} from '@reduxjs/toolkit'
import {eventReviewSLice} from "../../../model/events/event-review";
import {charsheetReviewSLice} from "../../../model/charsheets/reducer";
import {userSlice} from "../../../model/user/reducer";
import {themeSlice} from "../../../model/theme";
import {claimedItemsSlice} from "../../../model/claimed-items/reducer";
import AdminReducer from "../../../model/admin/reducer";
import CheckReducer from "../../../model/economics/checks/reducer";
import ArbiterBusinessRewardReducer from '../../../model/arbiters/business/reducer'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

const ConfiguredStore = configureStore({
    reducer: {
        charsheet: charsheetReviewSLice.reducer,
        event: eventReviewSLice.reducer,
        user: userSlice.reducer,
        theme: themeSlice.reducer,
        claimedItems: claimedItemsSlice.reducer,
        admin: AdminReducer,
        checks:  CheckReducer,
        business: ArbiterBusinessRewardReducer
        // comments: commentsReducer,
        // users: usersReducer,
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof ConfiguredStore.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof ConfiguredStore.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default class Store extends Service {
    private _store = ConfiguredStore

    getInstance() {
        return this._store
    }
}