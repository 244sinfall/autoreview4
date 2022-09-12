import React, {useEffect, useState} from 'react';
import {useAuth} from "../../../model/auth";
import ContentTitle from "../../../components/static/content-title";
import UserControl from "../user-control";
import './styles.css'

const UsersList = () => {
    const {currentUser} = useAuth()
    const [users, setUsers] = useState<React.ReactNode[]>()
    useEffect(() => {
        currentUser?.getAllUsers().then(users => {
            if(users) {
                setUsers(users.map((u) => {
                    return <UserControl key={u.email} user={currentUser} email={u.email} permission={u.permission}/>
                }))
            }
        })
    },[currentUser])
    return (
        <div className="users-list">
        <ContentTitle title={"Управление пользователями"}>
            <div className="user-list">
                {users}
            </div>
        </ContentTitle>
        </div>
    );
};

export default UsersList;