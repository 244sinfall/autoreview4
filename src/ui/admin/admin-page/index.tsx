import React from 'react';
import Protector from "../../protector";
import UsersList from "../user-list";
import './styles.css'
import {Permission} from "../../../model/auth/user";

const AdminPage = () => {
    return (
        <Protector accessLevel={Permission.admin}>
            <div className="admin-page">
                <UsersList/>
            </div>
        </Protector>
    );
};

export default AdminPage;