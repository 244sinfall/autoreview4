import React from 'react';
import RadioButtonGroup from "../../../common/radio-button-group";
import TextInput from "../../../common/text-input";
import Selector from "../../../common/selector";
import Field from "../../../common/field";
import {CheckStatus, CheckStatusCompanion} from "../../../../model/economics/checks/types";
import './styles.css'
type CheckTableFiltersProps = {
    statusFilterValue: CheckStatus | "Все",
    statusFilterOnChange: (newValue: CheckStatus | "Все") => void,
    searchOnChange: (newValue: string) => void,
    typeSelectValues: string[],
    typeSelectOnChange: (newValue: string) => void,
    showAmount: 20 | 50 | 100,
    showAmountOnChange: (newAmount: 20 | 50 | 100) => void,
}
const CheckTableFilters = (props: CheckTableFiltersProps) => {
    return (
        <div className="check-table-filters">
            <span className="check-table-filter-section">
                <RadioButtonGroup options={["Все", ...CheckStatusCompanion.list()]}
                              groupName={"check-table-filter-status"} onSelectionChange={props.statusFilterOnChange}
                              value={props.statusFilterValue}/>
                <span className="check-table-search-and-select">
                    <TextInput placeholder={"Поиск"} maxLength={128} onChange={props.searchOnChange}/>
                    <Selector options={props.typeSelectValues}
                          onSelectionChange={props.typeSelectOnChange}/>
                </span>
            </span>
            <Field title="Показывать" containerOptions={{direction: "column", justify: "center"}}>
            <RadioButtonGroup options={["20","50","100"]}
                              groupName={"check-table-filter-show"} onSelectionChange={sel => props.showAmountOnChange(Number(sel) as 20 | 50 | 100)}
                              value={String(props.showAmount)}/>
            </Field>
        </div>
    );
};

export default CheckTableFilters;