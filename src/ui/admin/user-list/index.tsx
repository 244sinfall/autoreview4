import React, {useEffect, useState} from 'react';

import ContentTitle from "../../../components/static/content-title";
import UserControl from "../user-control";
import './styles.css'
import LoadingSpinner from "../../../components/static/loading-spinner";
import {useAuth} from "../../../model/auth/firebase/auth";

const UsersList = () => {
    const {currentUser} = useAuth()
    const [users, setUsers] = useState<React.ReactNode[]>()
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        currentUser?.getAllUsers().then(users => {
            if(users) {
                setUsers(users.map((u) => {
                    return <UserControl key={u.email} user={currentUser} email={u.email} permission={u.permission}/>
                }))
            }
            setIsLoading(false)
        })
    },[currentUser])
    return (
        <div className="users-list">
            <LoadingSpinner spin={isLoading}>
                <ContentTitle title={"Управление пользователями"}>
                    <div className="user-list">
                        {users}
                    </div>
                </ContentTitle>
            </LoadingSpinner>

        </div>
    );
};

export default UsersList;