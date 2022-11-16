import prices from './prices.json'
import {CalculationResult} from "./index";

export type BuyBuildingMethods = "Ресурсы и золото" | "Ремесленные изделия" | "Прогресс"

export class BuyBuildingCalculator {
    protected level: number
    protected readonly payMethod: BuyBuildingMethods
    protected modifier: number
    constructor(level: number, modifier: number, payMethod: BuyBuildingMethods) {
        if(level > 7) level = 7
        this.level = level;
        this.payMethod = payMethod;
        this.modifier = modifier;
    }
    calculate(): CalculationResult {
        const level = String(this.level)
        const levelStr = level as keyof typeof prices.buildings.buy
        switch (this.payMethod) {
            case "Ремесленные изделия":
                return ({
                    tools: Math.round(prices.buildings.buy[levelStr].tools * this.modifier)
                })
            case "Ресурсы и золото":
                const obj = {...prices.buildings.buy[levelStr].resources}
                Object.keys(obj).forEach(key => obj[key as keyof typeof obj] = Math.round(obj[key as keyof typeof obj] * this.modifier))
                return ({
                    ...obj
                })
            case "Прогресс":
                return ({
                    progress: Math.round(prices.buildings.buy[levelStr].progress * this.modifier)
                })
        }
    }
}

export class UpgradeBuildingCalculator extends BuyBuildingCalculator {
    private readonly upgradeTo: number
    constructor(level: number, modifier: number, payMethod: BuyBuildingMethods, upgradeTo: number) {
        if(upgradeTo <= level || upgradeTo < 1) throw new Error("Невозможное вычисление")
        super(level, modifier, payMethod);
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
                            result[prop as keyof CalculationResult]! += Math.round(newValue * this.modifier)
                        } else {
                            result[prop as keyof CalculationResult] = Math.round(newValue * this.modifier)
                        }
                    }
                    break;
                case "Прогресс":
                    if(result.progress === undefined) result.progress = 0
                    result.progress += Math.round(prices.buildings.upgrade[nextLevelStr].progress * this.modifier)
                    break;
                case "Ремесленные изделия":
                    if(result.tools === undefined) result.tools = 0
                    result.tools += Math.round(prices.buildings.upgrade[nextLevelStr].tools * this.modifier)
                    break;
            }
            this.level++;
        }
        return result
    }
}