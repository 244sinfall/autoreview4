import prices from './prices.json'
import {
    BuildingPurchaseArguments,
    BuildingPurchaseMethod,
    CalculationResult,
    EconomicalCalculator,
    WithUpgradeArgument
} from "./types";
import * as fields from '../../../components/economics/purchase-calculator/fields'

const BuildingPurchaseMethods: BuildingPurchaseMethod[] = ["Ремесленные изделия", "Ресурсы и золото", "Прогресс"]

export class BuyBuildingCalculator implements EconomicalCalculator<BuildingPurchaseArguments, BuildingPurchaseMethod> {
    calculate(data: BuildingPurchaseArguments, payMethod: BuildingPurchaseMethod): CalculationResult {
        if(data.level < 0 || data.level > 7) throw new Error("Недопустимый уровень")
        if(data.modifier <= 0) throw new Error("Недопустимый модификатор")
        const level = String(data.level)
        const levelStr = level as keyof typeof prices.buildings.buy
        switch (payMethod) {
            case "Ремесленные изделия":
                return ({
                    tools: Math.round(prices.buildings.buy[levelStr].tools * data.modifier)
                })
            case "Ресурсы и золото":
                const obj = {...prices.buildings.buy[levelStr].resources}
                Object.keys(obj).forEach(key => obj[key as keyof typeof obj] = Math.round(obj[key as keyof typeof obj] * data.modifier))
                return ({
                    ...obj
                })
            case "Прогресс":
                return ({
                    progress: Math.round(prices.buildings.buy[levelStr].progress * data.modifier)
                })
        }
    }
    getCalculationTitle(data: BuildingPurchaseArguments): string {
        return `Постройка здания ${data.level} уровня`
    }

    getPayMethods(): BuildingPurchaseMethod[] {
        return BuildingPurchaseMethods
    }
    getRelativeComponent() {
        return fields.BuyBuildingCalculator
    }
    defaults(): BuildingPurchaseArguments {
        return {level: 0, modifier: 1}
    }
}

export class UpgradeBuildingCalculator
    implements EconomicalCalculator<WithUpgradeArgument<BuildingPurchaseArguments>, BuildingPurchaseMethod>{

    calculate(data: WithUpgradeArgument<BuildingPurchaseArguments>, payMethod: BuildingPurchaseMethod): CalculationResult {
        let result: CalculationResult = {}
        if(data.level < 0 || data.level > 7) throw new Error("Недопустимый уровень")
        if(data.modifier <= 0) throw new Error("Недопустимый модификатор")
        if(data.upgradeTo <= data.level || data.upgradeTo === 0 || data.upgradeTo > 7) throw new Error("Недопустимый уровень обновления")
        let level = data.level
        while(level !== data.upgradeTo && level !== 7) {
            const nextLevel = String(level + 1)
            const nextLevelStr = nextLevel as keyof typeof prices.buildings.upgrade
            switch (payMethod) {
                case "Ресурсы и золото":
                    const toUpgrade = prices.buildings.upgrade[nextLevelStr].resources
                    for(const prop in toUpgrade) {
                        // @todo Разобраться, почему здесь не работает
                        const newValue = toUpgrade[prop as keyof typeof toUpgrade] as number
                        if(prop in result) {
                            result[prop as keyof CalculationResult]! += Math.round(newValue * data.modifier)
                        } else {
                            result[prop as keyof CalculationResult] = Math.round(newValue * data.modifier)
                        }
                    }
                    break;
                case "Прогресс":
                    if(result.progress === undefined) result.progress = 0
                    result.progress += Math.round(prices.buildings.upgrade[nextLevelStr].progress * data.modifier)
                    break;
                case "Ремесленные изделия":
                    if(result.tools === undefined) result.tools = 0
                    result.tools += Math.round(prices.buildings.upgrade[nextLevelStr].tools * data.modifier)
                    break;
            }
            level++;
        }
        return result
    }
    getCalculationTitle(data: WithUpgradeArgument<BuildingPurchaseArguments>): string {
        return `Улучшение здания с ${data.level} ур. до ${data.upgradeTo} ур`
    }
    getRelativeComponent() {
        return fields.UpgradeBuildingCalculator
    }
    defaults(): WithUpgradeArgument<BuildingPurchaseArguments> {
        return {level: 0, modifier: 1, upgradeTo: 1}
    }

    getPayMethods(): BuildingPurchaseMethod[] {
        return BuildingPurchaseMethods
    }
}