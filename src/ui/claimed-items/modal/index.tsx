import React, {useCallback, useRef} from 'react';
import {useAppDispatch, useAppSelector} from "../../../model/hooks";
import ClaimedItemAdder from "../../../components/claimed-items/add";
import {
    removeAddModal,
    removeEditModal, setError, updateClaimedItemsContent,
} from "../../../model/claimed-items/reducer";
import {ClaimedItemsNetworkProvider} from "../../../model/claimed-items";
import ClaimedItemEditor from "../../../components/claimed-items/edit";

const ClaimedItemModal = () => {
    const networkProvider = useRef(new ClaimedItemsNetworkProvider())
    const state = useAppSelector(state => ({
        add: state.claimedItems.addModal,
        edit: state.claimedItems.editModal,
        user: state.user.user
    }))
    const dispatch = useAppDispatch()
    const onHandle = useCallback(async(fn: () => Promise<void>) => {
        try {
            await fn();
            await dispatch(updateClaimedItemsContent())
            if(state.add) dispatch(removeAddModal())
            if(state.edit) dispatch(removeEditModal())
        } catch (e) {
            if(e instanceof Error) {
                dispatch(setError(e))
            }
        }
    }, [dispatch, state.add, state.edit])
    return (
        <>
            {state.add && <ClaimedItemAdder quality={state.add}
                                                       reviewerName={state.user.name}
                                                       onAdd={item =>
                                                           onHandle(async() =>
                                                               networkProvider.current.add(item))}
                                                       onClose={() => dispatch(removeAddModal())}/>}
            {state.edit && <ClaimedItemEditor onEdit={item =>
                                                        onHandle(async() =>
                                                      networkProvider.current.update(item))}
                                              onApprove={id =>
                                                  onHandle(async() =>
                                                      networkProvider.current.accept(id))}
                                              onDelete={id =>
                                                  onHandle(async() =>
                                                      networkProvider.current.del(id))}
                                              onClose={() => dispatch(removeEditModal())}
                                              item={state.edit}
                                              user={state.user}/>}
        </>
    );
};

export default React.memo(ClaimedItemModal);