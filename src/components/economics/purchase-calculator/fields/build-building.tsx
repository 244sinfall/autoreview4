import React from 'react';
import NumberInput from "../../../common/number-input";
import Field from "../../../common/field";
import {
    BuildingPurchaseArguments,
    CalculationFieldsProps
} from "../../../../model/economics/economic-upgrade-calculator/types";
import {useFields} from "../use-fields";

const BuildBuildingFields = (props: CalculationFieldsProps<BuildingPurchaseArguments>) => {
    const { values, updateValues } = useFields<BuildingPurchaseArguments>(props.defaults,
        (newState) => props.onUpdate(newState))
    return (
        <div className="build-building-fields fields">
            <Field title={"Уровень здания"} containerOptions={{collapsedOptions: {widthToCollapse: 450}}}>
                <NumberInput minValue={0} value={values.level}
                             maxValue={7} onChange={level => updateValues("level", level)}/>
            </Field>
            <Field title={"Модификатор (т.е 0.8 для скидки 20%)"} containerOptions={{collapsedOptions: {widthToCollapse: 570}}}>
                <NumberInput onChange={modifier => updateValues("modifier", modifier)}
                             isFloat={true} maxValue={100} value={values.modifier}
                             minValue={0}/>
            </Field>
        </div>
    );
};

export default BuildBuildingFields;