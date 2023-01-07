import React, {useMemo} from 'react';
import ActionButton from "../../common/action-button";
import {ClaimedItemInterface} from "../../../model/claimed-items/types";
import Table from "../../common/table";
import styled from "styled-components";
import LoadingSpinner from "../../common/loading-spinner";
import Pagination from "../../common/pagination";
import './styles.css'

const TableHidableContainer = styled.div<{isShowing: boolean}>`
  display: ${props => props.isShowing ? "block" : "none"};
`

type ClaimedItemCategoryProps = {
    onAdd: () => void
    title: string
    isShowing: boolean
    onIsShowingChange: () => void
    isLoading: boolean
    content: ClaimedItemInterface[]
    render: (item: ClaimedItemInterface) => JSX.Element
    page: number,
    onPaginate: (newPage: number) => void
    isReviewer: boolean
}
const ClaimedItemCategory = (props: ClaimedItemCategoryProps) => {
    const table = useMemo(() =>
        <Table columns={["Название", "Владелец", "Доказательство владения", "Согласовавший",
            "Дата добавления", "Утвердивший", "Дата утверждения", "Доп. инфо"]}
               content={props.content.slice((props.page-1) * 10, props.page * 10)} renderFunction={props.render}/>,
        [props.page, props.content, props.render])
    return (
        <div className="claimed-item-category">
            <div className="claimed-item-category-header">
                <ActionButton title="Добавить предмет"
                              onClick={props.onAdd} disabled={!props.isReviewer} />
                <p>{props.title}</p>
                <ActionButton title={props.isShowing ? "Скрыть категорию" : "Показать категорию"}
                              onClick={props.onIsShowingChange}/>
            </div>
            <LoadingSpinner spin={props.isLoading}>
                <TableHidableContainer className="claimed-item-category-table" isShowing={props.isShowing}>
                    {table}
                    <Pagination className="claimed-item-category-pagination"
                                onPageChange={props.onPaginate}
                                currentPage={props.page}
                                itemsTotal={props.content.length} 
                                itemsPerPage={10}/>
                </TableHidableContainer>
            </LoadingSpinner>
            <hr className="claimed-item-table-delimiter"/>
        </div>
    );
};

export default React.memo(ClaimedItemCategory);