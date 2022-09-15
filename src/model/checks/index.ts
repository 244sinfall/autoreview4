import {APIAddress, getChecksEndPoint} from "../../config/api";

export interface Check {
    Id: number,
    Date: string,
    Owner: string,
    Type: string,
    Money: string,
    Name: string,
    Description: string,
    Body: string[],
    Status: string,
    Gm: string
}

export const defaultCheck = {
    Id: 0,
    Date: "",
    Owner: "",
    Type: "",
    Money: "",
    Name: "",
    Description: "",
    Body: [],
    Status: "",
    Gm: ""
}

export interface CheckResponse {
    checks: Check[],
    count: number,
    filteredCount: number,
    updatedAt: Date
}

export const defaultCheckTableSearchParams: CheckTableSearchParams = {
    limit: 50,
    skip: 0,
    search: "",
    status: "",
    sortMethod: "",
    sortDirection: "",
    force: false
}

export interface CheckTableSearchParams {
    limit: number,//Количество чеков на одной странице
    skip: number,// Количество чеков, которые пропускаются (количество чеков на странице * номер страницы)
    search: string,
    status: string,
    sortMethod: string,
    sortDirection: string,
    force: boolean
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

export async function getChecks(params?: CheckTableSearchParams) {
    const paramsStr = params ? parseChecksParams(params) : ""
    const response = await fetch(`${APIAddress}${getChecksEndPoint}${paramsStr}`)
    const json = await response.json()
    if (json["error"]) throw json
    const checkResponse = await json as CheckResponse
    for await(let check of checkResponse.checks) {
        const money = parseInt(check.Money)
        if(isNaN(money) || money === 0) {
            check.Money = "0 м."
            continue
        }
        const moneyInGold = money / 10000
        const goldValue = Math.floor(moneyInGold)
        const moneyInSilver = (moneyInGold - goldValue) * 100
        const silverValue = Math.floor(moneyInSilver)
        const copperValue = Math.floor((moneyInSilver - silverValue) * 100)
        let moneyStr = ""
        if(goldValue) moneyStr += `${goldValue} з. `
        if(silverValue) moneyStr += `${silverValue} с. `
        if(copperValue) moneyStr += `${copperValue} м.`
        check.Money = moneyStr
    }
    checkResponse.updatedAt = new Date(checkResponse.updatedAt)
    return checkResponse
}