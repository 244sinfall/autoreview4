import React, {useCallback, useEffect, useMemo} from 'react';
import ClaimedItemsWrapper from "../../components/claimed-items";
import ClaimedItemTable from "./wrapper";
import {claimedItemsAsyncActions, setSearch} from "../../model/claimed-items/reducer";
import {useAppDispatch, useAppSelector} from "../../services/services/store";
import ClaimedItemModal from "./modal";
import {ClaimedItemsHTMLGenerator} from "../../model/claimed-items/generator";
import {PERMISSION} from "../../model/user";

const ClaimedItemsPage = () => {
    const operationCallbacks = useMemo(() => claimedItemsAsyncActions, [])
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(operationCallbacks.getClaimedItemsContent())
    }, [dispatch, operationCallbacks])

    const state = useAppSelector(state => ({
        search: state.claimedItems.search,
        content: state.claimedItems.content,
        error: state.claimedItems.error,
        user: state.user.user
    }))
    const callbacks = {
        onHTMLGenerate: useCallback(async() => {
            const provider = new ClaimedItemsHTMLGenerator(state.content)
            return await navigator.clipboard.writeText(provider.generate())
        }, [state.content])
    }

    return (
        <ClaimedItemsWrapper currentSearch={state.search}
                             canGenerateHTML={state.user.permission >= PERMISSION.Admin}
                             onHTMLGenerate={callbacks.onHTMLGenerate}
                             onSearch={(newSearch) => dispatch(setSearch(newSearch))}
                             error={state.error}>
            <ClaimedItemTable quality={"legendary"}/>
            <ClaimedItemTable quality={"epic"}/>
            <ClaimedItemTable quality={"rare"}/>
            <ClaimedItemTable quality={"green"}/>
            <ClaimedItemTable quality={"other"}/>
            <ClaimedItemModal />
        </ClaimedItemsWrapper>
    );
};

export default React.memo(ClaimedItemsPage);