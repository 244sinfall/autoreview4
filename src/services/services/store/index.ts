import Service from "../service";
import {configureStore} from '@reduxjs/toolkit'
import {userSlice} from "../../../model/user/reducer";
import {themeSlice} from "../../../model/theme";
import ClaimedItemsReducer from "../../../model/claimed-items/reducer";
import CharsheetReviewGeneratorReducer from '../../../model/charsheets/reducer'
import AdminReducer from "../../../model/admin/reducer";
import CheckReducer from "../../../model/economics/checks/reducer";
import ArbiterItemsReducer from "../../../model/arbiters/items/reducer";
import ArbiterBusinessRewardReducer from '../../../model/arbiters/business/reducer'
import ArbiterEventRewardDistributionReducer from '../../../model/arbiters/event-rewards/reducer'
import GobSearcherReducer from '../../../model/gob-searcher/reducer'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import ServicesProvider from "../../index";

const ConfiguredStore = (services: ServicesProvider) => configureStore({
    reducer: {
        charsheet: CharsheetReviewGeneratorReducer,
        user: userSlice.reducer,
        theme: themeSlice.reducer,
        claimedItems: ClaimedItemsReducer,
        admin: AdminReducer,
        checks:  CheckReducer,
        business: ArbiterBusinessRewardReducer,
        eventReward: ArbiterEventRewardDistributionReducer,
        gobSearcher: GobSearcherReducer,
        arbiterItems: ArbiterItemsReducer,
        // comments: commentsReducer,
        // users: usersReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        thunk: {
            extraArgument: services
        }
    })
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<ReturnType<typeof ConfiguredStore>["getState"]>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = ReturnType<typeof ConfiguredStore>["dispatch"]
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default class Store extends Service {
    private _store = ConfiguredStore(this.services)

    getInstance() {
        return this._store
    }
}

