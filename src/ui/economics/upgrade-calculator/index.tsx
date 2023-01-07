import React, {useMemo, useState} from 'react';
import {CalculationPropName, CalculationResult} from "../../../model/economics/economic-upgrade-calculator/types";
import EconomicCalculatorWrapper from "../../../components/economics/purchase-calculator/wrapper";

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
    const content = useMemo(() => {
        if(titles.length === 0) return ""
        return `${titles.join(', ')}: ${Object.entries(totalResult).map((k) => {
            const key = k[0] as keyof CalculationResult
            const value = k[1] as number
            return `${CalculationPropName[key]}: ${value}`
        }).join(', ')}`
    }, [titles, totalResult])
    return (
        <EconomicCalculatorWrapper content={content} onClean={callbacks.onClean} onCalculationSubmit={callbacks.onSubmit}/>
    );
};

export default React.memo(UpgradeCalculator);