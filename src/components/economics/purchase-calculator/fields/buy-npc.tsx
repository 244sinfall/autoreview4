import React from 'react';
import Field from "../../../common/field";
import NumberInput from "../../../common/number-input";
import {
    CalculationFieldsProps,
    NpcPurchaseArguments,
} from "../../../../model/economics/economic-upgrade-calculator/types";
import {useFields} from "../use-fields";

const BuyNpcFields = (props: CalculationFieldsProps<NpcPurchaseArguments>) => {
    const { values, updateValues } = useFields<NpcPurchaseArguments>(props.defaults,
        (newState) => props.onUpdate(newState))
    return (
        <div className="buy-npc-fields fields" >
            <Field title={"Уровень НИП"} containerOptions={{collapsedOptions: {widthToCollapse: 450}}}>
                <NumberInput value={values.level} minValue={1} maxValue={6} onChange={level => updateValues("level", level)}/>
            </Field>
            <Field title={"Количество НИП"} containerOptions={{collapsedOptions: {widthToCollapse: 450}}}>
                <NumberInput value={values.amount} minValue={1} maxValue={99999} onChange={amount => updateValues("amount", amount)}/>
            </Field>
        </div>
    );
};

export default BuyNpcFields;