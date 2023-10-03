import React, {useEffect, useState} from 'react';
import Table from "../../../common/table";
import Pagination from "../../../common/pagination";
import './styles.css'
import {ArbiterItemInfo} from "../../../../model/arbiters/items/types";

type ItemsTableProps = {
    items: ArbiterItemInfo[],
    renderFunction: (check: ArbiterItemInfo) => JSX.Element
    showAmount: number,
    page: number,
    onPageChange: (page: number) => void
    total: number,
}

const ItemsTable = (props: ItemsTableProps) => {
    const [itemsShown, setItemsShown] = useState<ArbiterItemInfo[]>([])
    useEffect(() => {
        const startIndex = (props.page-1)*props.showAmount
        const endIndex = startIndex + props.showAmount < props.items.length ? startIndex + props.showAmount : props.items.length
        setItemsShown(props.items.slice(startIndex, endIndex))
    }, [props.showAmount, props.page, props.items])

    return (
        <>
            <Table columns={["ID","Название", "Качество", "Статы"]}
                    content={itemsShown}
                    renderFunction={props.renderFunction}/>
            <Pagination className="items-pagination"
                        itemsTotal={props.total}
                        itemsPerPage={props.showAmount}
                        currentPage={props.page}
                        onPageChange={props.onPageChange}/>
        </>
    );
};

export default ItemsTable;