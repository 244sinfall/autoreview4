import React from 'react';
import {GameObject} from "../../model/gob-searcher/types";
import Table from "../common/table";
import Pagination from "../common/pagination";
import './styles.css'

type GobSearcherTableProps = {
    items: GameObject[],
    render: (object: GameObject) => JSX.Element
    total: number
    onPaginate: (newPage: number) => void
    page: number
}

const GobSearcherTable = (props: GobSearcherTableProps) => {
    return (
        <div className="gob-searcher-container">
            <p className="gob-searcher-label">Нажмите на запись, чтобы скопировать команду для добавления в игре.</p>
            <Table columns={["ID", "Название", "Тип"]} content={props.items} renderFunction={props.render}/>
            <Pagination className="gob-searcher-pagination" itemsPerPage={30} itemsTotal={props.total} onPageChange={props.onPaginate} currentPage={props.page}/>
        </div>
    );
};

export default GobSearcherTable;