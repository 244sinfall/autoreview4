import React, {useCallback, useEffect, useState} from 'react';
import ContentTitle from "../../../components/common/content-title";
import GobSearcherFilter from "../../../components/gob-searcher/filter";
import GobSearcherTable from "../../../components/gob-searcher";
import {useAppDispatch, useAppSelector} from "../../../services/services/store";
import {fetchGameObjects, setPage, setSearch, setType} from "../../../model/gob-searcher/reducer";
import {GameObject, GameObjectTypeToName} from "../../../model/gob-searcher/types";
import GameObjectRow from "../../../components/gob-searcher/row";
import LoadingSpinner from "../../../components/common/loading-spinner";

const GobSearcher = () => {
    
    const state = useAppSelector(state => state.gobSearcher)
    const dispatch = useAppDispatch()
    const render = useCallback((item: GameObject) => <GameObjectRow key={item.id} item={item} onClick={async(item) => {
        return await navigator.clipboard.writeText(`.gob add ${item.id}`)
    }}/> , [])
    const [displayedItems, setDisplayedItems] = useState<GameObject[]>([])
    useEffect(() => {
        dispatch(fetchGameObjects())
    }, [dispatch])
    useEffect(() => {
        let displayedItems: GameObject[] = [...state.items];
        if(state.search) {
            displayedItems = displayedItems.filter(item => String(item.id).includes(state.search) || item.name.includes(state.search))
        }
        if(state.typeFilter !== "Все") {
            displayedItems = displayedItems.filter(item => GameObjectTypeToName[item.type] === state.typeFilter)
        }
        setDisplayedItems(displayedItems)
    }, [state.items, state.search, state.page, state.typeFilter])
    return (
        <ContentTitle title="Поиск ГО">
            <GobSearcherFilter search={state.search} onSearch={(newSearch) => dispatch(setSearch(newSearch))} type={state.typeFilter} onTypeChange={(newType) => dispatch(setType(newType))}/>
            <LoadingSpinner spin={state.isLoading}>
                <GobSearcherTable items={displayedItems.slice((state.page-1) * 30, ((state.page-1) * 30) + 30)} render={render} total={displayedItems.length}
                                  onPaginate={page => dispatch(setPage(page))}
                                  page={state.page}/>
            </LoadingSpinner>
        </ContentTitle>
    );
};

export default GobSearcher;