import React, {useState} from 'react';
import RadioButtonGroup from "../../../components/dynamic/radio-button-group";
import LoadingSpinner from "../../../components/static/loading-spinner";
import './styles.css'
import Visitor from "../../../model/auth/user";
import {AdminController} from "../../../model/auth/controllers/admin-controller";

const UserControl = (props: {user: Visitor, email: string, name: string, permission: number}) => {
    const [perm, setPerm] = useState(props.permission)
    const [isLoading, setIsLoading] = useState(false)
    const handleSwitch = (newPermission: string) => {
        const newPerm = Visitor.getPermissionValue(newPermission)
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
                <RadioButtonGroup title="" options={["Игрок","ГМ","Арбитр","Рецензент","Админ"]}
                                  defaultValue={Visitor.getPermissionName(perm)}
                                  groupName={props.email} handler={handleSwitch}/>

            </LoadingSpinner>
        </div>
    );
};

export default UserControl;