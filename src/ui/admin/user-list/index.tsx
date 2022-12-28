import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import ContentTitle from "../../../components/static/content-title";
import UserControl from "../user-control";
import './styles.css'
import LoadingSpinner from "../../../components/static/loading-spinner";
import {useAuth} from "../../../model/auth/use-auth";
import {AdminController, AdminUserData} from "../../../model/auth/controllers/admin-controller";
import Selector from "../../../components/dynamic/selector";
import Visitor, {PermissionNames} from "../../../model/auth/user";

const UsersList = () => {
    const {currentUser} = useAuth()
    const [users, setUsers] = useState<AdminUserData[]>([]);
    const [filter, setFilter] = useState<string>("Все");
    const controller = useRef<AdminController>(new AdminController(currentUser));
    const [isLoading, setIsLoading] = useState(true)
    const fetch = async () => {
        return await controller.current.getAllUsers();
    }
    const callbacks = {
        setFilter: useCallback((permissionName: string) => {
            setFilter(permissionName);
        }, []),
    }
    useEffect(() => {
        fetch().then(users => {
            setUsers(users)
            setIsLoading(false);
        })
    },[currentUser])

    const renderUsers = useMemo(() => {
        const currentList = filter === "Все" ? users : users.filter(u => Visitor.getPermissionName(u.permission) === filter)
        return currentList.map(u => <UserControl key={u.email} user={currentUser} email={u.email} name={u.name} permission={u.permission}/>)
    }, [users, filter, currentUser])
    
    return (
        <div className="users-list">
            <LoadingSpinner spin={isLoading}>
                <ContentTitle title={"Управление пользователями"} controllable={true}>
                    <div className="user-list-container">
                        <div className="user-list-filter">
                            Фильтровать по уровню доступа
                            <Selector options={["Все", ...PermissionNames]} selected={filter} changeHandler={callbacks.setFilter}/>
                        </div>
                        <div className="user-list">
                            {renderUsers}
                        </div>
                    </div>
                </ContentTitle>
            </LoadingSpinner>
        </div>
    );
};

export default React.memo(UsersList);