import React from 'react';
import Protector from "../../protector";
import UsersList from "../user-list";
import './styles.css'
import {PERMISSION} from "../../../model/auth/user";

const AdminPage = () => {
    return (
        <Protector accessLevel={PERMISSION.Admin}>
            <div className="admin-page">
                <UsersList/>
            </div>
        </Protector>
    );
};

export default AdminPage;