import prices from './prices.json'
import {
    CalculationResult,
    EconomicalCalculator, NpcPurchaseArguments,
    NPCPurchaseMethod, PurchaseMethod,
    WithUpgradeArgument
} from "./types";
import * as fields from "../../../components/economics/purchase-calculator/fields";

const NPCPurchaseMethods: NPCPurchaseMethod[] = ["Золото", "Прогресс", "Провиант"]

export class BuyNPCCalculator implements EconomicalCalculator<NpcPurchaseArguments, NPCPurchaseMethod> {
    protected isNPCPurchaseMethod(method: PurchaseMethod): method is NPCPurchaseMethod {
        return this.getPayMethods().includes(method as NPCPurchaseMethod);
    }
    calculate(data: NpcPurchaseArguments, payMethod: PurchaseMethod): CalculationResult {
        if(!this.isNPCPurchaseMethod(payMethod)) throw new Error("Недопустимый способ оплаты")
        if(data.level > 6 || data.level < 1) throw new Error("Недопустимый уровень")
        if(data.amount < 0) throw new Error("Нельзя купить 0")
        const level = String(data.level)
        const levelStr = level as keyof typeof prices.npcs.buy
        switch (payMethod) {
            case "Золото":
                return ({
                    gold: prices.npcs.buy[levelStr].gold * data.amount
                })
            case "Прогресс":
                return ({
                    progress: prices.npcs.buy[levelStr].progress * data.amount
                })
            case "Провиант":
                return ({
                    food: prices.npcs.buy[levelStr].food * data.amount
                })
        }
    }
    getPayMethods(): NPCPurchaseMethod[] {
        return NPCPurchaseMethods
    }
    getCalculationTitle(data: NpcPurchaseArguments): string {
        return `Покупка ${data.amount} НИП ${data.level} ур.`
    }
    getRelativeComponent() {
        return fields.BuyNPCCalculator
    }
    defaults(): NpcPurchaseArguments {
        return {level: 1, amount: 1}
    }
}

export class UpgradeNPCCalculator
    implements EconomicalCalculator<WithUpgradeArgument<NpcPurchaseArguments>, NPCPurchaseMethod>{
    getPayMethods(): NPCPurchaseMethod[] {
        return NPCPurchaseMethods
    }
    calculate(data: WithUpgradeArgument<NpcPurchaseArguments>, payMethod: PurchaseMethod): CalculationResult {

        if(data.level >= data.upgradeTo) throw new Error("Неверные значения уровней")
        if(data.level < 1 || data.level > 6 || data.upgradeTo < 2 || data.upgradeTo > 6) throw new Error("Недопустимые значения уровней")
        if(data.amount < 0) throw new Error("Невозможно купить 0")
        let result: CalculationResult = {}
        let level = data.level
        while(level !== data.upgradeTo && level !== 6) {
            const nextLevel = String(level + 1)
            const nextLevelStr = nextLevel as keyof typeof prices.npcs.upgrade
            switch (payMethod) {
                case "Золото":
                    if(result.gold === undefined) result.gold = 0
                    result.gold += prices.npcs.upgrade[nextLevelStr].gold * data.amount
                    break;
                case "Провиант":
                    if(result.food === undefined) result.food = 0
                    result.food += prices.npcs.upgrade[nextLevelStr].food * data.amount
                    break;
                case "Прогресс":
                    if(result.progress === undefined) result.progress = 0
                    result.progress += prices.npcs.upgrade[nextLevelStr].progress * data.amount
                    break;
            }
            level++;
        }
        return result
    }
    getCalculationTitle(data: WithUpgradeArgument<NpcPurchaseArguments>): string {
        return `Улучшение ${data.amount} НИП с ${data.level} ур. до ${data.upgradeTo} ур.`
    }
    getRelativeComponent() {
        return fields.UpgradeNPCCalculator
    }
    defaults(): WithUpgradeArgument<NpcPurchaseArguments> {
        return {level: 1, amount: 1, upgradeTo: 2};
    }
}