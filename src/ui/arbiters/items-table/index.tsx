import React, {useEffect,  useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../../services/services/store";
import {setPage, setPerPage, setSearch} from "../../../model/arbiters/items/reducer";
import {ArbiterItemInfo} from "../../../model/arbiters/items/types";
import ItemTableWrapper from "../../../components/arbiters/itemstable";
import ArbiterItemRow from "../../../components/arbiters/itemstable/table/row";

const ArbiterItemsTable = () => {
    const state = useAppSelector(state => state.arbiterItems)

    const dispatch = useAppDispatch()

    const [itemsToShow, setItemsToShow] = useState<ArbiterItemInfo[]>([])

    useEffect(() => {
        let items = state.items;
        if(state.search) {
            items = items.filter(entry => String(entry.id).includes(state.search) ||
            entry.name.includes(state.search) || entry.description.includes(state.search) ||
            entry.quality.includes(state.search))
        }
        setItemsToShow(items)
    }, [state])


    return (
        <ItemTableWrapper items={itemsToShow}
                          page={state.page}
                          perPage={state.perPage}
                          search={state.search}
                          onPaginate={page => dispatch(setPage(page))}
                          onPerPage={perPage => dispatch(setPerPage(perPage))}
                          onSearch={search => dispatch(setSearch(search))}
                          renderItem={item => <ArbiterItemRow key={item.id} item={item}/>}/>
    );
};

export default ArbiterItemsTable;