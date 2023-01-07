import React, {useMemo} from 'react';
import ContentTitle from "../../common/content-title";
import TabController from "../../common/tab-controller";
import PurchaseCalculator from "./calculator";
import {
    BuyBuildingCalculator,
    UpgradeBuildingCalculator
} from "../../../model/economics/economic-upgrade-calculator/buildings";
import {BuyNPCCalculator, UpgradeNPCCalculator} from "../../../model/economics/economic-upgrade-calculator/npcs";
import TextArea from "../../common/text-area";
import ActionButton from "../../common/action-button";
import {CalculationResult} from "../../../model/economics/economic-upgrade-calculator/types";
import './styles.css'

type EconomicCalculatorWrapperProps = {
    onCalculationSubmit: (title: string, value: CalculationResult) => void
    content: string,
    onClean: () => void,
}

const EconomicCalculatorWrapper = (props: EconomicCalculatorWrapperProps) => {
    const executors = useMemo(() => ({
        buyBuilding: new BuyBuildingCalculator(),
        upgradeBuilding: new UpgradeBuildingCalculator(),
        buyNPC: new BuyNPCCalculator(),
        upgradeNPC: new UpgradeNPCCalculator()
    }), [])
    return (
        <ContentTitle className="economic-purchase-calculator" title="Калькулятор строительства и улучшений" collapsable={true}>
            <TabController className="economic-purchase-calculator__fields" items={{
                "Построить здание": <PurchaseCalculator executor={executors.buyBuilding} onCalculate={props.onCalculationSubmit}/>,
                "Улучшить здание": <PurchaseCalculator executor={executors.upgradeBuilding} onCalculate={props.onCalculationSubmit} />,
                "Купить НИП": <PurchaseCalculator executor={executors.buyNPC} onCalculate={props.onCalculationSubmit}/>,
                "Улучшить НИП": <PurchaseCalculator executor={executors.upgradeNPC} onCalculate={props.onCalculationSubmit}/>,
            }}/>
            <div className="economic-purchase-calculator__info">
                <TextArea className="economical-purchase-calculator-result" value={props.content}/>
                <span className="economical-calculator-clean-button"><ActionButton title="Очистить" onClick={props.onClean}/></span>
            </div>
        </ContentTitle>
    );
};

export default React.memo(EconomicCalculatorWrapper);