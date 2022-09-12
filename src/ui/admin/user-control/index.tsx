import React, {useState} from 'react';
import RadioButtonGroup from "../../../components/dynamic/radio-button-group";
import {AuthorizedUser, getPermissionName, getPermissionValue} from "../../../model/auth";
import LoadingSpinner from "../../../components/static/loading-spinner";
import './styles.css'

const UserControl = (props: {user: AuthorizedUser, email: string, permission: number}) => {
    const [perm, setPerm] = useState(props.permission)
    const [isLoading, setIsLoading] = useState(false)
    const handleSwitch = (newPermission: string) => {
        const newPerm = getPermissionValue(newPermission)
        setIsLoading(true)
        props.user.changeRole(props.email, newPerm).then(() => {
            setIsLoading(false)
            setPerm(newPerm)
        })
    }
    return (
        <div className="user-data">
            {props.email}
            <LoadingSpinner spin={isLoading}>
                <RadioButtonGroup title="" options={["Игрок","ГМ","Админ"]} defaultValue={getPermissionName(perm)}
                                  groupName={props.email} handler={handleSwitch}/>

            </LoadingSpinner>
        </div>
    );
};

export default UserControl;