import React from 'react';
import {AdminUserData} from "../../../model/auth/controllers/admin-controller";
import './style.css'
interface AdminUserListProps {
    users: AdminUserData[],
    render: (user: AdminUserData) => JSX.Element
    shouldRender: (user: AdminUserData) => boolean
}

const AdminUserList = (props: AdminUserListProps) => {
    return (
        <div className="user-list">
            {props.users.filter(user => props.shouldRender(user)).map(user => props.render(user))}
        </div>
    );
};

export default React.memo(AdminUserList);