import React from 'react';
import Field from "../../../common/field";
import NumberInput from "../../../common/number-input";
import {
    CalculationFieldsProps,
    NpcPurchaseArguments,
    WithUpgradeArgument
} from "../../../../model/economics/economic-upgrade-calculator/types";
import {useFields} from "../use-fields";

const UpgradeNpcFields = (props: CalculationFieldsProps<WithUpgradeArgument<NpcPurchaseArguments>>) => {
    const { values, updateValues } = useFields<WithUpgradeArgument<NpcPurchaseArguments>>(props.defaults,
        (newState) => props.onUpdate(newState))
    return (
        <div className="upgrade-npc-fields fields">
            <Field title={"Уровень НИП"} containerOptions={{collapsedOptions: {widthToCollapse: 450}}}>
                <NumberInput value={values.level} minValue={1} maxValue={5} onChange={level => updateValues("level", level)}/>
            </Field>
            <Field title={"Желаемый уровень НИП"} containerOptions={{collapsedOptions: {widthToCollapse: 450}}}>
                <NumberInput value={values.upgradeTo} minValue={2} maxValue={6} onChange={upgradeTo => updateValues("upgradeTo", upgradeTo)}/>
            </Field>
            <Field title={"Количество НИП"} containerOptions={{collapsedOptions: {widthToCollapse: 450}}}>
                <NumberInput value={values.amount} minValue={1} maxValue={99999} onChange={amount => updateValues("amount", amount)}/>
            </Field>
        </div>
    );
};

export default UpgradeNpcFields;