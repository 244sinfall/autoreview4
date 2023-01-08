import React, {useCallback} from 'react';
import {useAppDispatch, useAppSelector} from "../../../../model/hooks";
import AdminSelectedUserModalWrapper from "../../../../components/admin/user-list/modal";
import {removeSelectedUser, setUserPermission} from "../../../../model/admin/reducer";
import AdminController from "../../../../model/auth/controllers/admin-controller";
import {PermissionName} from "../../../../model/auth/user";

const AdminSelectedUserModal = (props: { controller: AdminController }) => {
    const state = useAppSelector(state => ({
        selectedUser: state.admin.selectedUser
    }))
    const dispatch = useAppDispatch()
    const callbacks = {
        onPermissionChange: useCallback(async(newPermission: PermissionName) => {
            if(state.selectedUser === null) return
            return dispatch(await setUserPermission({
                controller: props.controller,
                user: state.selectedUser,
                newPermission: newPermission,
            }))
        }, [dispatch, props.controller, state.selectedUser])
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