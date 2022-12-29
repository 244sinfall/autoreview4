import React, {useState} from 'react';
import {AdminUserData} from "../../../../model/auth/controllers/admin-controller";
import RadioButtonGroup from "../../../common/dynamic/radio-button-group";
import Visitor, {PermissionName, PermissionNames, PermissionValue} from "../../../../model/auth/user";
import LoadingSpinner from "../../../common/static/loading-spinner";
import './style.css'

interface AdminUserDataProps  {
    user: AdminUserData
    onPermissionChange: (newPermission: PermissionValue) => Promise<void>
}

const AdminUserInfo = (props: AdminUserDataProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [value, setValue] = useState<PermissionName>(Visitor.getPermissionName(props.user.permission))
    const onChange = async (newPermission: PermissionName) => {
        setIsLoading(true)
        const newPermissionValue = Visitor.getPermissionValueByName(newPermission)
        await props.onPermissionChange(newPermissionValue)
        setValue(newPermission)
        setIsLoading(false)
    }
    return (
        <div className="user-data">
            <span className="user-data__credentials">
                {props.user.name} ({props.user.email})
            </span>
            <LoadingSpinner spin={isLoading}>
                <RadioButtonGroup title=""
                                  options={PermissionNames}
                                  groupName={props.user.email+"-role-selector"}
                                  defaultValue={value}
                                  handler={onChange}
                />
            </LoadingSpinner>
        </div>
    );
};

export default React.memo(AdminUserInfo);