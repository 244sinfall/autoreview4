import Service from "../service";
import {
    AsyncThunk,
    AsyncThunkOptions,
    AsyncThunkPayloadCreator,
    configureStore,
    createAsyncThunk
} from '@reduxjs/toolkit'
import {eventReviewSLice} from "../../../model/events/event-review";
import {charsheetReviewSLice} from "../../../model/charsheets/reducer";
import {userSlice} from "../../../model/user/reducer";
import {themeSlice} from "../../../model/theme";
import {claimedItemsSlice} from "../../../model/claimed-items/reducer";
import AdminReducer from "../../../model/admin/reducer";
import CheckReducer from "../../../model/economics/checks/reducer";
import ArbiterBusinessRewardReducer from '../../../model/arbiters/business/reducer'
import ArbiterEventRewardDistributionReducer from '../../../model/arbiters/event-rewards/reducer'

import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import ServicesProvider from "../../index";

const ConfiguredStore = (services: ServicesProvider)=> configureStore({
    reducer: {
        charsheet: charsheetReviewSLice.reducer,
        event: eventReviewSLice.reducer,
        user: userSlice.reducer,
        theme: themeSlice.reducer,
        claimedItems: claimedItemsSlice.reducer,
        admin: AdminReducer,
        checks:  CheckReducer,
        business: ArbiterBusinessRewardReducer,
        eventReward: ArbiterEventRewardDistributionReducer
        // comments: commentsReducer,
        // users: usersReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({thunk: {
        extraArgument: services
        }})
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<ReturnType<typeof ConfiguredStore>["getState"]>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = ReturnType<typeof ConfiguredStore>["dispatch"]
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

type AsyncThunkConfig = {
    /** return type for `thunkApi.getState` */
    state?: unknown
    /** type for `thunkApi.dispatch` */
    dispatch?: AppDispatch
    /** type of the `extra` argument for the thunk middleware, which will be passed in as `thunkApi.extra` */
    extra?: ServicesProvider
    /** type to be passed into `rejectWithValue`'s first argument that will end up on `rejectedAction.payload` */
    rejectValue?: unknown
    /** return type of the `serializeError` option callback */
    serializedErrorType?: unknown
    /** type to be returned from the `getPendingMeta` option callback & merged into `pendingAction.meta` */
    pendingMeta?: unknown
    /** type to be passed into the second argument of `fulfillWithValue` to finally be merged into `fulfilledAction.meta` */
    fulfilledMeta?: unknown
    /** type to be passed into the second argument of `rejectWithValue` to finally be merged into `rejectedAction.meta` */
    rejectedMeta?: unknown
}

type TypedCreateAsyncThunk<ThunkApiConfig extends AsyncThunkConfig> = <Returned, ThunkArg = void>(
    typePrefix: string,
    payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, ThunkApiConfig>,
    options?: AsyncThunkOptions<ThunkArg, ThunkApiConfig>
) => AsyncThunk<Returned, ThunkArg, ThunkApiConfig>;

export const createAppAsyncThunk: TypedCreateAsyncThunk<{
    state: RootState,
    extra: ServicesProvider
}> = createAsyncThunk;
export default class Store extends Service {
    private _store = ConfiguredStore(this.services)

    getInstance() {
        return this._store
    }
}