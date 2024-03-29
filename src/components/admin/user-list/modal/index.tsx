import React from 'react';
import ModalTitle from "../../../common/modal-title";
import {PermissionName, PermissionNameByValue, PermissionNames} from "../../../../model/user";
import Field from "../../../common/field";
import RadioButtonGroup from "../../../common/radio-button-group";

import './styles.css'
import {FirestoreUserData} from "../../../../model/user/";
import ActionButton from "../../../common/action-button";

type AdminSelectedUserModalWrapperProps = {
    user: FirestoreUserData & {error?: string},
    onPermissionChange: (newPermission: PermissionName) => Promise<unknown>,
    onResetPassword: () => Promise<unknown>,
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
                                  value={PermissionNameByValue[props.user.permission]}
                                  onSelectionChange={props.onPermissionChange}/>
            </Field>
            <Field title="Сбросить пароль">
                <ActionButton title="Сбросить пароль"
                              onClick={props.onResetPassword}
                              type="button"
                              tooltip="На почту, на которую зарегистрирован аккаунт придет
                              письмо с ссылкой на восстановление пароля."/>
            </Field>
        </ModalTitle>
    );
};

export default AdminSelectedUserModalWrapper;