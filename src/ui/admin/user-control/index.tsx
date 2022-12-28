import React, {useState} from 'react';
import RadioButtonGroup from "../../../components/common/dynamic/radio-button-group";
import LoadingSpinner from "../../../components/common/static/loading-spinner";
import './styles.css'
import Visitor, {PermissionName, PermissionNames, PermissionValue} from "../../../model/auth/user";
import {AdminController} from "../../../model/auth/controllers/admin-controller";

const UserControl = (props: {user: Visitor, email: string, name: string, permission: PermissionValue}) => {
    const [perm, setPerm] = useState(props.permission)
    const [isLoading, setIsLoading] = useState(false)
    const handleSwitch = (newPermission: PermissionName) => {
        const newPerm = Visitor.getPermissionValueByName(newPermission)
        const adminControl = new AdminController(props.user)
        setIsLoading(true)
        adminControl.changeRole(props.email, newPerm).then(() => {
            setIsLoading(false)
            setPerm(newPerm)
        })

    }
    return (
        <div className="user-data">
            {props.name} ({props.email})
            <LoadingSpinner spin={isLoading}>
                <RadioButtonGroup title="" options={PermissionNames}
                                  defaultValue={Visitor.getPermissionName(perm)}
                                  groupName={props.email} handler={handleSwitch}/>

            </LoadingSpinner>
        </div>
    );
};

export default UserControl;