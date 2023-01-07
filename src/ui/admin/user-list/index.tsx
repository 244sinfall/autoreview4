import React, {useCallback, useEffect, useRef, useState} from 'react';
import ContentTitle from "../../../components/common/content-title";
import {AdminController, AdminUserData} from "../../../model/auth/controllers/admin-controller";
import Visitor, {PermissionNames} from "../../../model/auth/user";
import AdminUserListFilter, {PermissionFilterOptions} from "../../../components/admin/user-list/filter";
import AdminUserList from "../../../components/admin/user-list";
import AdminUserInfo from "../../../components/admin/user-list/user";
import LoadingSpinner from "../../../components/common/loading-spinner";
import {useAppSelector} from "../../../model/hooks";

const UsersList = () => {
    const currentUser = useAppSelector(state => state.user.user)
    const [users, setUsers] = useState<AdminUserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<PermissionFilterOptions>("Все");
    const controller = useRef<AdminController>(new AdminController(currentUser));
    const callbacks = {
        shouldRender: useCallback((user: AdminUserData) =>
            currentUser.email !== user.email && (filter === "Все" || filter === Visitor.getPermissionName(user.permission)),
            [currentUser.email, filter]),
        renderUser: useCallback((user: AdminUserData) =>
            <AdminUserInfo key={`${user.email}_${user.name}`}
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
            <ContentTitle title="Управление пользователями" collapsable={false}>
                <AdminUserListFilter onPermissionChange={callbacks.setFilter} possiblePermissions={["Все", ...PermissionNames]}/>
                <AdminUserList users={users} shouldRender={callbacks.shouldRender} render={callbacks.renderUser}/>
            </ContentTitle>
        </LoadingSpinner>
    );
};

export default React.memo(UsersList);