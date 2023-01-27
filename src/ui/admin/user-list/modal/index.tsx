import React, {useCallback} from 'react';
import {useAppDispatch, useAppSelector} from "../../../../services/services/store";
import AdminSelectedUserModalWrapper from "../../../../components/admin/user-list/modal";
import {removeSelectedUser, setUserPermission} from "../../../../model/admin/reducer";
import {PermissionName} from "../../../../model/user";

const AdminSelectedUserModal = () => {
    const state = useAppSelector(state => ({
        selectedUser: state.admin.selectedUser
    }))
    const dispatch = useAppDispatch()
    const callbacks = {
        onPermissionChange: useCallback(async(newPermission: PermissionName) => {
            if(state.selectedUser === null) return
            return dispatch(await setUserPermission({
                user: state.selectedUser,
                newPermission: newPermission,
            }))
        }, [dispatch, state.selectedUser])
    }

    return (
        <>
            {state.selectedUser && <AdminSelectedUserModalWrapper user={state.selectedUser} 
                                                                  onClose={() => dispatch(removeSelectedUser())} 
                                                                  onPermissionChange={callbacks.onPermissionChange}/>}
        </>
    );
};

export default AdminSelectedUserModal;