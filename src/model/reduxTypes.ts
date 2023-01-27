import {AsyncThunk, AsyncThunkOptions, AsyncThunkPayloadCreator, createAsyncThunk} from "@reduxjs/toolkit";
import ServicesProvider from "../services";
import {AppDispatch, RootState} from "../services/services/store";


type AsyncThunkConfig = {
    /** return type for `thunkApi.getState` */
    state?: RootState
    /** type for `thunkApi.dispatch` */
    dispatch?: AppDispatch
    /** type of the `extra` argument for the thunk middleware, which will be passed in as `thunkApi.extra` */
    extra?: ServicesProvider
    /** type to be passed into `rejectWithValue`'s first argument that will end up on `rejectedAction.payload` */
    rejectValue?: Error
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