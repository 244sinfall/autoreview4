import React from 'react';
import Field from "../../../common/field";
import NumberInput from "../../../common/number-input";
import {
    BuildingPurchaseArguments, CalculationFieldsProps,
    WithUpgradeArgument
} from "../../../../model/economics/economic-upgrade-calculator/types";
import {useFields} from "../use-fields";

const UpgradeBuildingFields = (props: CalculationFieldsProps<WithUpgradeArgument<BuildingPurchaseArguments>>) => {
    const { values, updateValues } = useFields<WithUpgradeArgument<BuildingPurchaseArguments>>(props.defaults,
        (newState) => props.onUpdate(newState))
    return (
        <div className="upgrade-building-fields fields">
            <Field title={"Уровень здания"} containerOptions={{collapsedOptions: {widthToCollapse: 450}}}>
                <NumberInput value={values.level} minValue={0} maxValue={7} onChange={level => updateValues("level", level)}/>
            </Field>
            <Field title={"Обновить до"} containerOptions={{collapsedOptions: {widthToCollapse: 450}}}>
                <NumberInput value={values.upgradeTo} minValue={1} maxValue={7} onChange={upgradeTo => updateValues("upgradeTo", upgradeTo)}/>
            </Field>
            <Field title={"Модификатор (т.е 0.8 для скидки 20%)"} containerOptions={{collapsedOptions: {widthToCollapse: 570}}}>
                <NumberInput value={values.modifier} onChange={modifier => updateValues("modifier", modifier)}
                             isFloat={true} maxValue={100}
                             minValue={0}/>
            </Field>
        </div>
    );
};

export default UpgradeBuildingFields;