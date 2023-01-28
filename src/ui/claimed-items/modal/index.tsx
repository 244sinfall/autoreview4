import React, {useMemo} from 'react';
import {useAppDispatch, useAppSelector} from "../../../services/services/store";
import ClaimedItemAdder from "../../../components/claimed-items/add";
import {
    claimedItemsAsyncActions,
    removeAddModal,
    removeEditModal
} from "../../../model/claimed-items/reducer";
import ClaimedItemEditor from "../../../components/claimed-items/edit";

const ClaimedItemModal = () => {
    const operationCallbacks = useMemo(() => claimedItemsAsyncActions, [])
    const state = useAppSelector(state => ({
        add: state.claimedItems.addModal,
        edit: state.claimedItems.editModal,
        user: state.user.user
    }))
    const dispatch = useAppDispatch()

    return (
        <>
            {state.add && <ClaimedItemAdder quality={state.add}
                                                       reviewerName={state.user.name}
                                                       onAdd={async(item) => {
                                                           await dispatch(operationCallbacks.addClaimedItem(item))
                                                           await dispatch(operationCallbacks.getClaimedItemsContent())
                                                           return
                                                       }}
                                                       onClose={() => dispatch(removeAddModal())}/>}
            {state.edit && <ClaimedItemEditor onEdit={async(item) => {
                                                            await dispatch(operationCallbacks.updateClaimedItem(item))
                                                            await dispatch(operationCallbacks.getClaimedItemsContent())
                                                            return
                                                        }}
                                                       onApprove={async (id) =>{
                                                           await dispatch(operationCallbacks.approveClaimedItem(id))
                                                           await dispatch(operationCallbacks.getClaimedItemsContent())
                                                           return
                                                       }}
                                                      onDelete={async (id) => {
                                                          await dispatch(operationCallbacks.removeClaimedItem(id))
                                                          await dispatch(operationCallbacks.getClaimedItemsContent())
                                                          return
                                                      }}

                                              onClose={() => dispatch(removeEditModal())}
                                              item={state.edit}
                                              user={state.user}/>}
        </>
    );
};

export default React.memo(ClaimedItemModal);