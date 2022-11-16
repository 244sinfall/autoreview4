import React, {useMemo, useState} from 'react';
import {
    BuyBuildingCalculator,
    BuyBuildingMethods,
    UpgradeBuildingCalculator
} from "../../../../model/economics/economic-upgrade-calculator/buildings";
import NumberInput from "../../../../components/dynamic/number-input";
import ActionButton from "../../../../components/static/action-button";
import RadioButtonGroup from "../../../../components/dynamic/radio-button-group";
import './style.css'
import {CalculationResult} from "../../../../model/economics/economic-upgrade-calculator";
import {
    BuyNPCCalculator,
    BuyNPCMethods,
    UpgradeNPCCalculator
} from "../../../../model/economics/economic-upgrade-calculator/npcs";

const EconomicPurchaseCalculator = (props: { subject: "building" | "npc", upgradable: boolean, onSubmit: (title: string, result: CalculationResult) => void }) => {
    const [level, setLevel] = useState(0)
    const [upgradeTo, setUpgradeTo] = useState(0)
    const [amount, setAmount] = useState(0)
    const [modifier, setModifier] = useState(1)
    const [payMethod, setPayMethod] = useState<BuyBuildingMethods | BuyNPCMethods | null>(null)
    const callbacks = {
        onLevelChange: (fieldName: string, fieldValue: number) => setLevel(fieldValue),
        onUpgradeToChange: (fieldName: string, fieldValue: number) => setUpgradeTo(fieldValue),
        onPayMethodChange: (value: string) => {
            const payMethod = value as BuyBuildingMethods
            setPayMethod(payMethod)
        },
        onNPCAmountChange: (fieldName: string, fieldValue: number) => setAmount(fieldValue),
        onModifierChange: (fieldName: string, fieldValue: number) => setModifier(fieldValue),
        onAdd: () => {
            if(props.subject === "building") {
                const modifierStr = modifier !== 1 ? `(Модификатор ${modifier})` : ""
                if(props.upgradable) {
                    const result = new UpgradeBuildingCalculator(level, modifier, payMethod as BuyBuildingMethods, upgradeTo).calculate()
                    props.onSubmit(`Улучшение здания с ${level} ур. до ${upgradeTo} ур.${modifierStr}`, result)
                } else {
                    const result = new BuyBuildingCalculator(level, modifier, payMethod as BuyBuildingMethods).calculate()
                    props.onSubmit(`Покупка здания ${level} ур.${modifierStr}`, result)
                }
            } else {
                if(props.upgradable) {
                    const result = new UpgradeNPCCalculator(level, amount, payMethod as BuyNPCMethods, upgradeTo).calculate()
                    props.onSubmit(`Улучшение ${amount} НИП с ${level} до ${upgradeTo} ур.`, result)
                } else {
                    const result = new BuyNPCCalculator(level, amount, payMethod as BuyNPCMethods).calculate()
                    props.onSubmit(`Покупка ${amount} НИП ${level} ур.`, result)
                }

            }
        }
    }
    const showCountButton = useMemo(() => {
        if(payMethod === null) return false
        if(props.subject === "npc") {
            if(level < 1 || amount < 1) return false
            if(props.upgradable && upgradeTo <= level) return false
        }
        if(props.subject === "building") {
            if(props.upgradable && upgradeTo <= level) return false
        }
        return true
    }, [amount, level, payMethod, props.subject, props.upgradable, upgradeTo])
    const maxLevel = useMemo(() => {
        if(props.subject === "building") return 7
        return 6
    }, [props.subject])
    const options = useMemo(() => {
        if(props.subject === "building") {
            return ["Ресурсы и золото", "Прогресс", "Ремесленные изделия"]
        }
        return ["Золото", "Прогресс", "Рем. изделия", "Провиант"]
    }, [props.subject])
    return (
        <div className="BuildBuyer">
            {props.subject === "npc" && <NumberInput title="Введите количество НИП" minValue={0} maxValue={9999}
                                                     handler={callbacks.onNPCAmountChange} floatable={false} disabled={false}/>}
            <NumberInput title={"Введите уровень " + (props.subject === "building" ? "здания": "НИП")}
                         disabled={false} minValue={0} maxValue={maxLevel}
                         handler={callbacks.onLevelChange} floatable={false}/>
            {props.upgradable && <NumberInput title="Введите желаемый уровень" disabled={false} minValue={0}
                                              maxValue={maxLevel}
                                                          handler={callbacks.onUpgradeToChange} floatable={false}/>}
            {props.subject === "building" && <NumberInput title="Модификатор (т.е 0.8 для скидки 20%)"
                                                          handler={callbacks.onModifierChange} disabled={false}
                                                          floatable={true} maxValue={100}
                                                          minValue={0} defaultValue={modifier}/>}
            <RadioButtonGroup title="Выберите способ оплаты" options={options} groupName="build-buy-group" handler={callbacks.onPayMethodChange}/>
            <ActionButton title="Посчитать" show={showCountButton} action={callbacks.onAdd} requiresLoading={false}/>
        </div>
    );
};

export default React.memo(EconomicPurchaseCalculator);