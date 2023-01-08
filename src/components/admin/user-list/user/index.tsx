import React from 'react';
import Visitor from "../../../../model/auth/user";
import './style.css'
import {AdminUserData} from "../../../../model/auth/controllers/admin-controller/types";
import useStrictClickHandler from "../../../common/strict-click-handler";

interface AdminUserDataProps  {
    user: AdminUserData
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
            <td className="table-content" data-label="Доступ:">{Visitor.getPermissionName(props.user.permission)}</td>
        </tr>
    );
};

export default React.memo(AdminUserInfoRow);