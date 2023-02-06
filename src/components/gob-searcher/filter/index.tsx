import React from 'react';
import {GameObjectTypeFilter, GameObjectTypeFilterOptions} from "../../../model/gob-searcher/types";
import Field from "../../common/field";
import Selector from "../../common/selector";
import TextInput from "../../common/text-input";
import './styles.css'

type GobSearcherFilterProps = {
    search: string,
    onSearch: (newSearch: string) => void,
    type: GameObjectTypeFilter,
    onTypeChange: (newType: GameObjectTypeFilter) => void
}

const GobSearcherFilter = (props: GobSearcherFilterProps) => {
    return (
        <div className="gob-searcher-filter-container">
            <Field title="Поиск" containerOptions={{justify: "center"}}>
                <TextInput value={props.search} onChange={props.onSearch}/>
            </Field>
            <Field title="Фильтр по типу" containerOptions={{justify:"center"}}>
                <Selector options={GameObjectTypeFilterOptions} onSelectionChange={props.onTypeChange}/>
            </Field>
        </div>
    );
};

export default GobSearcherFilter;