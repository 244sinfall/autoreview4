import React, {useMemo, useState} from 'react';
import {
    BuyBuildingCalculator,
    BuyBuildingMethods,
    CalculationResult, UpgradeBuildingCalculator
} from "../../../../model/economics/economic-upgrade-calculator/base";
import NumberInput from "../../../../components/dynamic/number-input";
import ActionButton from "../../../../components/static/action-button";
import RadioButtonGroup from "../../../../components/dynamic/radio-button-group";
import './style.css'

const BuildBuyer = (props: { upgradable: boolean, onSubmit: (title: string, result: CalculationResult) => void }) => {
    const [level, setLevel] = useState(0)
    const [upgradeTo, setUpgradeTo] = useState(0)
    const [payMethod, setPayMethod] = useState<BuyBuildingMethods | null>(null)
    const callbacks = {
        onLevelChange: (fieldName: string, fieldValue: number) => setLevel(fieldValue),
        onUpgradeToChange: (fieldName: string, fieldValue: number) => setUpgradeTo(fieldValue),
        onPayMethodChange: (value: string) => {
            const payMethod = value as BuyBuildingMethods
            setPayMethod(payMethod)
        },
        onAdd: () => {
            if(props.upgradable) {
                const result = new UpgradeBuildingCalculator(level, payMethod!, upgradeTo).calculate()
                props.onSubmit(`Улучшение здания с ${level} ур. до ${upgradeTo} ур.`, result)
            } else {
                const result = new BuyBuildingCalculator(level, payMethod!).calculate()
                props.onSubmit(`Покупка здания ${level} ур.`, result)
            }
        }
    }
    const showCountButton = useMemo(() => {
        if(payMethod === null) return false
        if(!props.upgradable) return true
        return upgradeTo > level
        
    }, [level, payMethod, props.upgradable, upgradeTo])
    return (
        <div className="BuildBuyer">
            <NumberInput title="Введите уровень здания" disabled={false} minValue={0} maxValue={7}
                         handler={callbacks.onLevelChange} floatable={false}/>
            {props.upgradable && <NumberInput title="Введите желаемый уровень" disabled={false} minValue={0} maxValue={7}
                                                          handler={callbacks.onUpgradeToChange} floatable={false}/>}
            <RadioButtonGroup title="Выберите способ оплаты" options={[
                "Ресурсы и золото",
                "Прогресс",
                "Ремесленные изделия"
            ]} groupName="build-buy-group" handler={callbacks.onPayMethodChange}/>
            <ActionButton title="Посчитать" show={showCountButton} action={callbacks.onAdd} requiresLoading={false}/>
        </div>
    );
};

export default React.memo(BuildBuyer);