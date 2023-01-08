import React from 'react';
import ModalTitle from "../../../common/modal-title";
import {AdminUserData} from "../../../../model/auth/controllers/admin-controller/types";
import Visitor, {PermissionName, PermissionNames} from "../../../../model/auth/user";
import Field from "../../../common/field";
import RadioButtonGroup from "../../../common/radio-button-group";

import './styles.css'

type AdminSelectedUserModalWrapperProps = {
    user: AdminUserData & {error?: string},
    onPermissionChange: (newPermission: PermissionName) => Promise<unknown>
    onClose: () => void
}

const AdminSelectedUserModalWrapper = (props: AdminSelectedUserModalWrapperProps) => {
    return (
        <ModalTitle title={`Управление ${props.user.name}`} className="user-control-modal" closeCallback={props.onClose}>
            {props.user.error && <p>Ошибка: {props.user.error}</p>}
            <p>Email: {props.user.email}</p>
            <Field title={"Доступ"} containerOptions={{direction: "column"}}>
                <RadioButtonGroup options={PermissionNames}
                                  groupName={`${props.user.email}-permission-control`}
                                  value={Visitor.getPermissionName(props.user.permission)}
                                  onSelectionChange={props.onPermissionChange}/>
            </Field>
        </ModalTitle>
    );
};

export default AdminSelectedUserModalWrapper;