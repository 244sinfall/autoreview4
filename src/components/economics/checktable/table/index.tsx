import React from 'react';
import LoadingSpinner from "../../../common/loading-spinner";
import Table from "../../../common/table";
import Pagination from "../../../common/pagination";
import {Check} from "../../../../model/economics/checks/check";

type CheckTableProps = {
    checks: Check[],
    renderFunction: (check: Check) => JSX.Element
    isLoading: boolean
    filteredCheckCount: number,
    showAmount: number,
    page: number,
    onPageChange: (page: number) => void
}

const CheckTable = (props: CheckTableProps) => {
    return (
        <LoadingSpinner spin={props.isLoading}>
            <Table columns={["ID","Дата и время", "Владелец", "Тип", "Название",
                    "Описание","Деньги","ГМ","Статус","Вложения"]}
                    content={props.checks}
                    renderFunction={props.renderFunction}/>
            <Pagination itemsTotal={props.filteredCheckCount}
                        itemsPerPage={props.showAmount}
                        currentPage={props.page}
                        onPageChange={props.onPageChange}/>
        </LoadingSpinner>
    );
};

export default CheckTable;