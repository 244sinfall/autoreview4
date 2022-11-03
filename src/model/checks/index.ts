import {APIAddress, getChecksEndPoint} from "../../config/api";

interface CheckItem {
    count: number
    name: string
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
        const moneyInGold = this.money / 10000
        const goldValue = Math.floor(moneyInGold)
        const moneyInSilver = (moneyInGold - goldValue) * 100
        const silverValue = Math.floor(moneyInSilver)
        const copperValue = Math.floor((moneyInSilver - silverValue) * 100)
        let moneyStr = ""
        if(goldValue) moneyStr += `${goldValue} з. `
        if(silverValue) moneyStr += `${silverValue} с. `
        if(copperValue) moneyStr += `${copperValue} м.`
        return moneyStr
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