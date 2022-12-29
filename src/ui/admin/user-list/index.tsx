import React, {useCallback, useEffect, useRef, useState} from 'react';
import ContentTitle from "../../../components/common/static/content-title";
import {useAuth} from "../../../model/auth/use-auth";
import {AdminController, AdminUserData} from "../../../model/auth/controllers/admin-controller";
import Visitor, {PermissionNames} from "../../../model/auth/user";
import AdminUserListFilter, {PermissionFilterOptions} from "../../../components/admin/user-list/filter";
import AdminUserList from "../../../components/admin/user-list";
import AdminUserInfo from "../../../components/admin/user-list/user";
import LoadingSpinner from "../../../components/common/static/loading-spinner";

const UsersList = () => {
    const {currentUser} = useAuth()
    const [users, setUsers] = useState<AdminUserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<PermissionFilterOptions>("Все");
    const controller = useRef<AdminController>(new AdminController(currentUser));
    const callbacks = {
        shouldRender: useCallback((user: AdminUserData) =>
            currentUser.email !== user.email && (filter === "Все" || filter === Visitor.getPermissionName(user.permission)),
            [currentUser.email, filter]),
        renderUser: useCallback((user: AdminUserData) =>
            <AdminUserInfo key={user.email}
                           user={user}
                           onPermissionChange={(v) => controller.current.changeRole(user.email, v)}/>,
            []),
        setFilter: useCallback((permissionName: PermissionFilterOptions) => setFilter(permissionName), []),
    }

    useEffect(() => {
        controller.current.getAllUsers().then(users => {
            setUsers(users)
            setIsLoading(false);
        })
    },[currentUser])
    
    return (
        <LoadingSpinner spin={isLoading}>
            <ContentTitle title="Управление пользователями" controllable={false}>
                <AdminUserListFilter onPermissionChange={callbacks.setFilter} possiblePermissions={["Все", ...PermissionNames]}/>
                <AdminUserList users={users} shouldRender={callbacks.shouldRender} render={callbacks.renderUser}/>
            </ContentTitle>
        </LoadingSpinner>
    );
};

export default React.memo(UsersList);