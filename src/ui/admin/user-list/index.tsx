import React, {useEffect, useState} from 'react';
import ContentTitle from "../../../components/static/content-title";
import UserControl from "../user-control";
import './styles.css'
import LoadingSpinner from "../../../components/static/loading-spinner";
import {useAuth} from "../../../model/auth/use-auth";
import AuthorizedUser from "../../../model/auth/user/authorized-user";
import {AdminController} from "../../../model/auth/controllers/admin-controller";

const UsersList = () => {
    const {currentUser} = useAuth()
    const [users, setUsers] = useState<React.ReactNode[]>()
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        if(currentUser instanceof AuthorizedUser) {
            const adminController = new AdminController(currentUser)
            adminController.getAllUsers().then((users: any) => {
                if(users) {
                    setUsers(users.map((u: any) => {
                        return <UserControl key={u.email} user={currentUser} email={u.email} name={u.name} permission={u.permission}/>
                    }))
                    setIsLoading(false)
                }
            })
        }
    },[currentUser])
    return (
        <div className="users-list">
            <LoadingSpinner spin={isLoading}>
                <ContentTitle title={"Управление пользователями"} controllable={true}>
                    <div className="user-list">
                        {users}
                    </div>
                </ContentTitle>
            </LoadingSpinner>

        </div>
    );
};

export default React.memo(UsersList);