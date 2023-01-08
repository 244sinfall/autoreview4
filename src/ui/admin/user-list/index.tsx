import React, {useCallback, useEffect, useRef, useState} from 'react';
import ContentTitle from "../../../components/common/content-title";
import Visitor from "../../../model/auth/user";
import AdminUserListFilter from "../../../components/admin/user-list/filter";
import AdminUserList from "../../../components/admin/user-list";
import AdminUserInfo from "../../../components/admin/user-list/user";
import {useAppDispatch, useAppSelector} from "../../../model/hooks";
import {AdminUserData} from "../../../model/auth/controllers/admin-controller/types";
import AdminController from "../../../model/auth/controllers/admin-controller";
import {
    fetchAdminUserList,
    setPage,
    setPermissionFilter,
    setSearchFilter,
    setSelectedUser
} from "../../../model/admin/reducer";
import {AdminReducerPermissionFilter} from "../../../model/admin/types";
import AdminSelectedUserModal from "./modal";

const UsersList = () => {
    const state = useAppSelector(state => ({
        user: state.user.user,
        userList: state.admin.users,
        isLoading: state.admin.isLoading,
        page: state.admin.page,
        filter: state.admin.filter
    }))
    const dispatch = useAppDispatch();
    const controller = useRef<AdminController>(new AdminController(state.user));
    const [displayingUser, setDisplayingUser] = useState<AdminUserData[]>([]);
    const callbacks = {
        renderUser: useCallback((user: AdminUserData) =>
            <AdminUserInfo key={`${user.email}_${user.name}`}
                           user={user}
                           onClick={() => dispatch(setSelectedUser(user))} />,
            [dispatch]),
    }

    useEffect(() => {
        dispatch(fetchAdminUserList(controller.current))
    },[dispatch])
    useEffect(() => {
        let users = state.userList
        if(state.filter.search)
            users = users.filter(user => {
                const searchPhrase = state.filter.search.toLowerCase()
                return user.name.toLowerCase().includes(searchPhrase) ||
                user.email.toLowerCase().includes(searchPhrase)
            })
        if(state.filter.permission !== "Все") {
            const permission: Exclude<AdminReducerPermissionFilter, "Все"> = state.filter.permission
            users = users.filter(user => user.permission === Visitor.getPermissionValueByName(permission))
        }
        setDisplayingUser(users)
    }, [state.filter.search, state.filter.permission, state.userList])
    return (
        <ContentTitle title="Управление пользователями" collapsable={false}>
            <AdminUserListFilter onPermissionFilter={(permission) => 
                                                dispatch(setPermissionFilter(permission))}
                                 onSearch={search => dispatch(setSearchFilter(search))}/>
            <AdminUserList users={displayingUser.slice((state.page-1) * 10, state.page * 10)}
                           render={callbacks.renderUser}
                           isLoading={state.isLoading}
                           page={state.page} 
                           onPaginate={(page) => dispatch(setPage(page))} 
                           usersAmount={displayingUser.length}/>
            <AdminSelectedUserModal controller={controller.current}/>
        </ContentTitle>
    );
};

export default React.memo(UsersList);