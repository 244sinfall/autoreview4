type CheckItem = {
    count: number
    name: ItemName
}

type ItemName = string

export type ItemQuality = "low" | "usual" | "unusual" | "rare" | "epic"

export type CheckStatus = "Ожидает" | "Закрыт" | "Отказан"

export const CheckStatusCompanion = {
    list: (): CheckStatus[] => ["Ожидает", "Закрыт", "Отказан"],
}
export const CheckStatusValue: Record<CheckStatus | "Все", string> = {
    "Все": "Все", "Закрыт": "closed", "Ожидает": "open", "Отказан": "rejected"

}

export type ICheck = {
    id: number,
    date: string,
    sender: string,
    receiver: string,
    subject: string,
    body: string,
    money: number,
    gmName: string,
    status: CheckStatus,
    items: CheckItem[] | null
}



export type CheckResponse = {
    checks: ICheck[],
    count: number,
    filteredCount: number,
    types: string[],
    updatedAt: Date
}

export const CheckTableParamsCompanion = {
    default: (): CheckTableParams => ({
        limit: 50,
        skip: 0,
        category: "",
        search: "",
        status: "Все",
        sortMethod: "",
        sortDirection: "",
        force: false
    }),
    is: (data: string): data is keyof CheckTableParams => {
       return data === "limit" || data === "skip" || data === "category" || data === "search" || data === "status" ||
       data === "sortMethod" || data === "sortDirection" || data === "force"
    }
}

export type CheckTableParams = {
    limit: 20 | 50 | 100,//Количество чеков на одной странице
    skip: number,// Количество чеков, которые пропускаются (количество чеков на странице * номер страницы)
    category: string,
    search: string,
    status: CheckStatus | "Все",
    sortMethod: string,
    sortDirection: string,
    force: boolean
}