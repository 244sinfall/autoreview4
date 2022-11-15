import prices from './prices.json'
import {CalculationResult} from "./index";

export type BuyBuildingMethods = "Ресурсы и золото" | "Ремесленные изделия" | "Прогресс"

export class BuyBuildingCalculator {
    protected level: number
    protected readonly payMethod: BuyBuildingMethods
    constructor(level: number, payMethod: BuyBuildingMethods) {
        if(level > 7) level = 7
        this.level = level;
        this.payMethod = payMethod;
    }
    calculate(): CalculationResult {
        const level = String(this.level)
        const levelStr = level as keyof typeof prices.buildings.buy
        switch (this.payMethod) {
            case "Ремесленные изделия":
                return ({
                    tools: prices.buildings.buy[levelStr].tools
                })
            case "Ресурсы и золото":
                return ({
                    ...prices.buildings.buy[levelStr].resources
                })
            case "Прогресс":
                return ({
                    progress: prices.buildings.buy[levelStr].progress
                })
        }
    }
}

export class UpgradeBuildingCalculator extends BuyBuildingCalculator {
    private readonly upgradeTo: number
    constructor(level: number, payMethod: BuyBuildingMethods, upgradeTo: number) {
        if(upgradeTo <= level || upgradeTo < 1) throw new Error("Невозможное вычисление")
        super(level, payMethod);
        this.upgradeTo = upgradeTo
    }
    calculate(): CalculationResult {
        let result: CalculationResult = {}
        while(this.level !== this.upgradeTo && this.level !== 7) {
            const nextLevel = String(this.level + 1)
            const nextLevelStr = nextLevel as keyof typeof prices.buildings.upgrade
            switch (this.payMethod) {
                case "Ресурсы и золото":
                    const toUpgrade = prices.buildings.upgrade[nextLevelStr].resources
                    for(const prop in toUpgrade) {
                        // @todo Разобраться, почему здесь не работает
                        const newValue = toUpgrade[prop as keyof typeof toUpgrade] as number
                        if(prop in result) {
                            result[prop as keyof CalculationResult]! += newValue
                        } else {
                            result[prop as keyof CalculationResult] = newValue
                        }
                    }
                    break;
                case "Прогресс":
                    if(result.progress === undefined) result.progress = 0
                    result.progress += prices.buildings.upgrade[nextLevelStr].progress
                    break;
                case "Ремесленные изделия":
                    if(result.tools === undefined) result.tools = 0
                    result.tools += prices.buildings.upgrade[nextLevelStr].tools
                    break;
            }
            this.level++;
        }
        return result
    }
}