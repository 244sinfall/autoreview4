import React, {useMemo, useState} from 'react';
import ContentTitle from "../../../components/common/static/content-title";
import TabController from "../../../components/common/static/tab-controller";
import TextAreaReadOnly from "../../../components/common/dynamic/text-area-read-only";
import ActionButton from "../../../components/common/static/action-button";
import './style.css'
import EconomicPurchaseCalculator from "./economic-purchase-calculator";
import {CalculationResult} from "../../../model/economics/economic-upgrade-calculator";

const UpgradeCalculator = () => {
    const [titles, setTitles] = useState<string[]>([])
    const [totalResult, setTotalResult] = useState<CalculationResult>({})
    const callbacks = {
        onSubmit: (title: string, value: CalculationResult) => {
            setTitles([...titles, title])
            const newTotalResult = {...totalResult}
            for(let prop in value) {
                if(prop in newTotalResult) {
                    newTotalResult[prop as keyof CalculationResult]! += value[prop as keyof CalculationResult]!
                } else {
                    newTotalResult[prop as keyof CalculationResult] = value[prop as keyof CalculationResult]
                }
            }
            setTotalResult(newTotalResult)
        },
        onClean: () => {
            setTitles([])
            setTotalResult({})
        }
    }
    const calculationPropName = (key: keyof CalculationResult) => {
        switch (key) {
            case "food": return "Поставки 'Провиант'"
            case "progress": return "Прогресс"
            case "gold": return "Золото"
            case "ore": return "Поставки 'Руда'"
            case "stone": return "Поставки 'Камень'"
            case "tools": return "Ремесленные изделия"
            case "wood": return "Поставки 'Дерево'"
        }
    }
    const content = useMemo(() => {
        if(titles.length === 0) return ""
        let result = titles.join(', ') + ": "
        for(let prop in totalResult) {
            result += `${calculationPropName(prop as keyof CalculationResult)}: ${totalResult[prop as keyof CalculationResult]}. `
        }
        return result
    }, [titles, totalResult])
    return (
        <ContentTitle title="Калькулятор строительства и улучшений" controllable={true} padding={"no-padding"}>
            <TabController items={{
                "Построить здание": <EconomicPurchaseCalculator subject={"building"} upgradable={false} onSubmit={callbacks.onSubmit}/>,
                "Улучшить здание": <EconomicPurchaseCalculator subject={"building"} upgradable={true} onSubmit={callbacks.onSubmit}/>,
                "Купить НИП": <EconomicPurchaseCalculator subject={"npc"} upgradable={false} onSubmit={callbacks.onSubmit}/>,
                "Улучшить НИП": <EconomicPurchaseCalculator subject={"npc"} upgradable={true} onSubmit={callbacks.onSubmit}/>,
            }}/>
            <div className="UpgradeCalculator-controls">
                <TextAreaReadOnly content={content} height={100}/>
                <ActionButton title="Очистить" show={true} action={callbacks.onClean} requiresLoading={false}/>
            </div>
        </ContentTitle>
    );
};

export default React.memo(UpgradeCalculator);