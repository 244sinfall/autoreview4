import React from 'react';
import {PermissionNameByValue} from "../../../../model/user";
import './style.css'
import useStrictClickHandler from "../../../common/strict-click-handler";
import {FirestoreUserData} from "../../../../model/user/";

interface AdminUserDataProps  {
    user: FirestoreUserData
    onClick: () => void
}

const AdminUserInfoRow = (props: AdminUserDataProps) => {
    const mouseCallbacks = useStrictClickHandler(props.onClick)
    return (
        <tr id={props.user.email + "-row"} className="table-row"
            onMouseDown={mouseCallbacks.recordMousePos}
            onMouseUp={mouseCallbacks.compareMousePos}>
            <td className="table-content" data-label="Ник:">{props.user.name}</td>
            <td className="table-content" data-label="Почта:">{props.user.email}</td>
            <td className="table-content" data-label="Доступ:">{PermissionNameByValue[props.user.permission]}</td>
        </tr>
    );
};

export default React.memo(AdminUserInfoRow);