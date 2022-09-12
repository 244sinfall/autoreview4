import React from 'react';
import Protector from "../../protector";
import UsersList from "../user-list";
import './styles.css'

const AdminPage = () => {
    return (
        <Protector accessLevel={2}>
            <div className="admin-page">
                <UsersList/>
            </div>
        </Protector>
    );
};

export default AdminPage;