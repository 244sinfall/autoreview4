import React from 'react';
import RadioButtonGroup from "../../../common/radio-button-group";
import Field from "../../../common/field";
import './styles.css'
import TextInput from "../../../common/text-input";
type ItemsTableFilterProps = {
    searchOnChange: (newValue: string) => void,
    search: string,
    showAmount: number,
    showAmountOnChange: (newAmount: number) => void,
}
const ItemsTableFilter = (props: ItemsTableFilterProps) => {
    return (
        <div className="items-table-filter">
            <Field title="Показывать" containerOptions={{direction: "column", justify: "center"}}>
            <RadioButtonGroup options={["20","50","100"]}
                              groupName={"items-table-filter-show"} onSelectionChange={sel => props.showAmountOnChange(Number(sel))}
                              value={String(props.showAmount)}/>
            </Field>
            <Field title="Поиск" containerOptions={{direction: "column", justify: "center"}}>
                <TextInput placeholder={"Поиск"} maxLength={128} onChange={props.searchOnChange} value={props.search}/>
            </Field>
        </div>
    );
};

export default ItemsTableFilter;