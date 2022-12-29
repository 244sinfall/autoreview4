import React from 'react';
import Selector from "../../../common/dynamic/selector";
import {PermissionName} from "../../../../model/auth/user";
import './style.css'
export type PermissionFilterOptions = "Все" | PermissionName

interface AdminUserListFilterProps {
    possiblePermissions: PermissionFilterOptions[],
    onPermissionChange: (newPermission: PermissionFilterOptions) => void
}

const AdminUserListFilter = (props: AdminUserListFilterProps) => {
    return (
        <div className="user-list-filter">
            <span className="user-list-filter-choice">Фильтровать по уровню доступа
                <Selector options={props.possiblePermissions}
                          changeHandler={(v) => props.onPermissionChange(v)}/>
            </span>
        </div>
    );
};

export default React.memo(AdminUserListFilter);