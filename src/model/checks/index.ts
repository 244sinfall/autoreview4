import {APIAddress, getChecksEndPoint} from "../../config/api";
import * as QualitiesObj from './qualities.json'
import * as RandomItems from './randomItems.json'

interface CheckItem {
    count: number
    name: ItemName
}

type ItemName = string

type ItemQuality = "low" | "usual" | "unusual" | "rare" | "epic"

type RandomItemsDescription = {
    [K in ItemQuality]: { name: string, id: number }
}


export interface ICheck {
    id: number,
    date: string,
    sender: string,
    receiver: string,
    subject: string,
    body: string,
    money: number,
    gmName: string,
    status: string,
    items: CheckItem[] | null
}

export interface CheckResponse {
    checks: ICheck[],
    count: number,
    filteredCount: number,
    types: string[],
    updatedAt: Date
}

export const defaultCheckTableSearchParams: CheckTableSearchParams = {
    limit: 50,
    skip: 0,
    category: "",
    search: "",
    status: "",
    sortMethod: "",
    sortDirection: "",
    force: false
}

export interface CheckTableSearchParams {
    limit: number,//Количество чеков на одной странице
    skip: number,// Количество чеков, которые пропускаются (количество чеков на странице * номер страницы)
    category: string,
    search: string,
    status: string,
    sortMethod: string,
    sortDirection: string,
    force: boolean
}

export class Check implements ICheck {
    body: string;
    date: string;
    gmName: string;
    id: number;
    items: CheckItem[] | null;
    money: number;
    receiver: string;
    sender: string;
    status: string;
    subject: string;
    constructor(check: ICheck) {
        this.body = check.body
        this.date = check.date
        this.gmName = check.gmName
        this.id = check.id
        this.items = check.items
        this.money = check.money
        this.receiver = check.receiver
        this.sender = check.sender
        this.status = check.status
        this.subject = check.subject
    }
    get itemsString() {
        if(!this.items) return ""
        const itemNames = this.items.map(item => item.name)
        const uniqueItems = [...new Set(itemNames)]
        const uniqueItemsWithAmount = uniqueItems.map(itemName => {
            let count = 0;
            this.items!.forEach((item) => {
                if(item.name === itemName) {
                    count += item.count
                }
            })
            return [itemName, count]
        })
        return uniqueItemsWithAmount.map(item => `[${item[0]}]x${item[1]}\n`)
    }
    get moneyString() {
        if(isNaN(this.money) || this.money === 0) return "0 м."
        const money = {gold: 0, silver: 0, copper: 0}
        let moneyRemain = this.money
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
    private getNextQuality(quality: ItemQuality): ItemQuality | null {
        switch (quality) {
            case "low":
                return "usual"
            case "usual":
                return "unusual"
            case "unusual":
                return "rare"
            case "rare":
                return "epic"
            default:
                return null
        }
    }
    reforge(): string | null {
        if(!this.items) return null
        const qualified = this.items.filter(item => item.name in QualitiesObj)
        if(qualified.length === 0) return null
        const count = qualified.reduce((prev, curr) => curr.count + prev, 0)
        if(count !== 4) return null
        const baseQuality = QualitiesObj[qualified[0].name as keyof typeof QualitiesObj] as ItemQuality
        if(qualified.every(item => QualitiesObj[item.name as keyof typeof QualitiesObj] === baseQuality)
            && this.getNextQuality(baseQuality)) {
            const quality = this.getNextQuality(baseQuality)!
            const items = RandomItems as RandomItemsDescription
            return `.send it ${this.sender} "Перековка" "${items[quality].name}" ${items[quality].id}`
        }
        return null
    }
}


export function getCheckStatusValue(status: string) {
    switch (status) {
        case "Ожидает": return "open"
        case "Закрыт": return "closed"
        case "Отказан": return "rejected"
        default: return ""
    }
}

export function getCheckStatusName(status: string) {
    switch (status) {
        case "open": return "Ожидает"
        case "closed": return "Закрыт"
        case "rejected": return "Отказан"
        default: return "Все"
    }
}

function parseChecksParams(params: CheckTableSearchParams): string {
    let delimiter = "&"
    let query = "?"
    for(let prop in params) {
        if(params[prop as keyof typeof params]) {
            if(!query.endsWith("?")) query += delimiter
            query += `${prop}=${String(params[prop as keyof typeof params])}`
        }
    }
    return query
}

export async function getChecks(params?: CheckTableSearchParams, token?:string) {
    const paramsStr = params ? parseChecksParams(params) : ""
    const response = await fetch(`${APIAddress}${getChecksEndPoint}${paramsStr}`, {method: "GET", headers:{"Authorization": token ? token : ""}})
    const json = await response.json()
    if (json["error"]) throw json
    const checkResponse = await json as CheckResponse
    checkResponse.types = ["Все получатели", ...checkResponse.types.filter(t => t && t !== "-")]
    checkResponse.checks = checkResponse.checks.map(check => new Check(check))
    checkResponse.updatedAt = new Date(checkResponse.updatedAt)
    return checkResponse
}