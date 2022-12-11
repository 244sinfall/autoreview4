import prices from './prices.json'
import {CalculationResult} from "./index";

export type BuyNPCMethods = "Золото" | "Прогресс" | "Провиант"

export class BuyNPCCalculator {
    protected level: number
    protected amount: number
    protected readonly payMethod: BuyNPCMethods
    constructor(level: number, amount: number, payMethod: BuyNPCMethods) {
        if(level > 6) level = 6
        if(level < 1) level = 1
        this.level = level;
        this.payMethod = payMethod;
        this.amount = amount;
    }
    calculate(): CalculationResult {
        const level = String(this.level)
        const levelStr = level as keyof typeof prices.npcs.buy
        switch (this.payMethod) {
            case "Золото":
                return ({
                    gold: prices.npcs.buy[levelStr].gold * this.amount
                })
            case "Прогресс":
                return ({
                    progress: prices.npcs.buy[levelStr].progress * this.amount
                })
            case "Провиант":
                return ({
                    food: prices.npcs.buy[levelStr].food * this.amount
                })
        }
    }
}

export class UpgradeNPCCalculator extends BuyNPCCalculator {
    private readonly upgradeTo: number
    constructor(level: number, amount: number, payMethod: BuyNPCMethods, upgradeTo: number) {
        super(level, amount, payMethod);
        if(upgradeTo <= this.level || upgradeTo < 2) throw new Error("Невозможное вычисление")
        this.upgradeTo = upgradeTo
    }
    calculate(): CalculationResult {
        let result: CalculationResult = {}
        while(this.level !== this.upgradeTo && this.level !== 6) {
            const nextLevel = String(this.level + 1)
            const nextLevelStr = nextLevel as keyof typeof prices.npcs.upgrade
            switch (this.payMethod) {
                case "Золото":
                    if(result.gold === undefined) result.gold = 0
                    result.gold += prices.npcs.upgrade[nextLevelStr].gold * this.amount
                    break;
                case "Провиант":
                    if(result.food === undefined) result.food = 0
                    result.food += prices.npcs.upgrade[nextLevelStr].food * this.amount
                    break;
                case "Прогресс":
                    if(result.progress === undefined) result.progress = 0
                    result.progress += prices.npcs.upgrade[nextLevelStr].progress * this.amount
                    break;
            }
            this.level++;
        }
        return result
    }
}