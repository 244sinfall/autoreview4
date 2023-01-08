import React from 'react';
import Selector from "../../../common/selector";
import './style.css'
import {AdminReducerPermissionFilter, AdminReducerPermissionFilterList} from "../../../../model/admin/types";
import Field from "../../../common/field";
import TextInput from "../../../common/text-input";

interface AdminUserListFilterProps {
    onPermissionFilter: (newPermission: AdminReducerPermissionFilter) => void
    onSearch: (newSearch: string) => void
}

const AdminUserListFilter = (props: AdminUserListFilterProps) => {
    return (
        <div className="user-list-filter">
            <p className="user-list-filter-title">Фильтры:</p>
            <div className="user-list-filters">
                <Field title="Уровень доступа">
                <Selector options={AdminReducerPermissionFilterList}
                          onSelectionChange={props.onPermissionFilter}/>
                </Field>
                <Field title="Поиск">
                    <TextInput onChange={props.onSearch}/>
                </Field>
            </div>
        </div>
    );
};

export default React.memo(AdminUserListFilter);