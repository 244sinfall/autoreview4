import React from 'react';
import ContentTitle from "../../common/content-title";
import './styles.css'
import ItemsTableFilter from "./filter";
import {ArbiterItemInfo, ArbiterItemsState} from "../../../model/arbiters/items/types";
import ItemsTable from "./table";


type ItemsTableWrapperProps = {
    onSearch: (search: string) => void,
    onPaginate: (newPage: number) => void,
    onPerPage: (newPerPage: number) => void,
    renderItem: (item: ArbiterItemInfo) => JSX.Element
} & ArbiterItemsState
const ItemTableWrapper = (props: ItemsTableWrapperProps) => {
    return (
        <ContentTitle className="items-table" title={"Предметы"} collapsable={true}>
            <ItemsTableFilter searchOnChange={props.onSearch}
                              search={props.search}
                              showAmount={props.perPage}
                              showAmountOnChange={props.onPerPage}/>
            <ItemsTable items={props.items} showAmount={props.perPage}
                        onPageChange={props.onPaginate}
                        page={props.page}
                        total={props.items.length}
                        renderFunction={props.renderItem}/>
        </ContentTitle>
    );
};

export default ItemTableWrapper;