import React from 'react';
import LoadingSpinner from "../../../common/loading-spinner";
import Table from "../../../common/table";
import Pagination from "../../../common/pagination";
import {ICheck} from "../../../../model/economics/checks/types";
import './styles.css'

type CheckTableProps = {
    checks: ICheck[],
    renderFunction: (check: ICheck) => JSX.Element
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
            <Pagination className="checks-pagination"
                        itemsTotal={props.filteredCheckCount}
                        itemsPerPage={props.showAmount}
                        currentPage={props.page}
                        onPageChange={props.onPageChange}/>
        </LoadingSpinner>
    );
};

export default CheckTable;