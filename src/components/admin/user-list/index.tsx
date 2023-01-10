import React, {useMemo} from 'react';
import './style.css'
import LoadingSpinner from "../../common/loading-spinner";
import Table from "../../common/table";
import Pagination from "../../common/pagination";
import {FirestoreUserData} from "../../../model/user/";
interface AdminUserListProps {
    users: FirestoreUserData[],
    render: (user: FirestoreUserData) => JSX.Element
    isLoading: boolean
    page: number,
    onPaginate: (newPage: number) => void
    usersAmount: number,
}

const AdminUserList = (props: AdminUserListProps) => {
    const table = useMemo(() => {
        return <Table columns={["Ник", "Почта", "Доступ"]} content={props.users} renderFunction={props.render}/>
    }, [props.users, props.render])
    return (
        <div className="user-list">
            <LoadingSpinner spin={props.isLoading}>
                {table}
            </LoadingSpinner>
            <Pagination itemsPerPage={10}
                        currentPage={props.page}
                        onPageChange={props.onPaginate}
                        itemsTotal={props.usersAmount}/>
        </div>
    );
};

export default React.memo(AdminUserList);