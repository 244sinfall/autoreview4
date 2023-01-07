import * as QualitiesObj from "./qualities.json";
import * as RandomItems from "./randomItems.json";
import {ICheck, ItemQuality} from "./types";

export class Check {
    constructor(public readonly check: ICheck) {
    }
    get itemsString() {
        if(!this.check.items) return ""
        const itemNames = this.check.items.map(item => item.name)
        const uniqueItems = [...new Set(itemNames)]
        const uniqueItemsWithAmount = uniqueItems.map(itemName => {
            let count = 0;
            this.check.items!.forEach((item) => {
                if(item.name === itemName) {
                    count += item.count
                }
            })
            return [itemName, count]
        })
        return uniqueItemsWithAmount.map(item => `[${item[0]}]x${item[1]}\n`)
    }
    get moneyString() {
        if(isNaN(this.check.money) || this.check.money === 0) return "0 м."
        const money = {gold: 0, silver: 0, copper: 0}
        let moneyRemain = this.check.money
        if(moneyRemain > 10000) {
            money.gold = Math.floor(moneyRemain / 10000)
            moneyRemain = moneyRemain % 10000
        }
        if(moneyRemain > 100) {
            money.silver = Math.floor(moneyRemain / 100)
            moneyRemain = moneyRemain % 100
        }
        money.copper = moneyRemain
        let moneyStr = ""
        if(money.gold) moneyStr += `${money.gold} з. `
        if(money.silver) moneyStr += `${money.silver} с. `
        if(money.copper) moneyStr += `${money.copper} м.`
        return moneyStr
    }
    static NextQualityOf: Record<ItemQuality, ItemQuality | null> = {
        epic: null,
        rare: "epic",
        unusual: "rare",
        usual: "unusual",
        low: "usual",
    }
    reforge(): string | null {
        if(!this.check.items) return null
        const qualified = this.check.items.filter(item => item.name in QualitiesObj)
        if(qualified.length === 0) return null
        const count = qualified.reduce((prev, curr) => curr.count + prev, 0)
        if(count !== 4) return null
        const qualitiesObject = QualitiesObj as {[key: string]: ItemQuality | undefined}
        const baseQuality = qualitiesObject[qualified[0].name]
        if(!baseQuality) return null
        if(qualified.every(item => QualitiesObj[item.name as keyof typeof QualitiesObj] === baseQuality)
            && Check.NextQualityOf[baseQuality]) {
            const quality = Check.NextQualityOf[baseQuality]!
            const items = RandomItems as Record<ItemQuality, {name: string, id: number}>
            return `.send it ${this.check.sender} "Перековка" "${items[quality].name}" ${items[quality].id}`
        }
        return null
    }
}