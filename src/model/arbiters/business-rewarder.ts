export interface BusinessRewardInfo {
    owner: string,
    poi: string,
    resource: number,
    poiLevel: number,
    labors: number,
    double: boolean
}

export const defaultBusinessInfo: BusinessRewardInfo = {
    owner: "",
    poi: "",
    resource: 0,
    poiLevel: 0,
    labors: 0,
    double: false
}

export const getResourceId = (resource: string) => {
    switch (resource) {
        case "Руда": return 1000072
        case "Камень": return 1000073
        case "Провиант": return 1000074
        case "Трава": return 1000071
        case "Древесина": return 1000076
        case "Рем. изделия": return 1000069
        case "Золото": return -1
        default:
            return 0
    }
}

export const resources = [
    "Выберите тип ресурса",
    "Руда",
    "Камень",
    "Провиант",
    "Трава",
    "Древесина",
    "Рем. изделия",
    "Золото"
]

const firstLevelResourceProductivityByPOILevel = new Map([
    [0, 0],
    [1, 2.5],
    [2, 5],
    [3, 7.5],
    [4, 10],
    [5, 12.5],
    [6, 15],
    [7, 17.5]
])

const secondLevelResourceProductivityByPOILevel = new Map([
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
    [5, 5],
    [6, 6],
    [7, 7]
])

const goldResourceProductivityByPOILevel = new Map([
    [0, 0],
    [1, 10000],
    [2, 20000],
    [3, 30000],
    [4, 40000],
    [5, 50000],
    [6, 60000],
    [7, 70000]
])

export const getCommand = (info: BusinessRewardInfo) => {
    if(info.labors === 0 || info.poiLevel === 0 || info.resource === 0) return ""
    const multiplier = info.double ? 2 : 1
    const finalMod = multiplier * info.labors
    switch(info.resource) {
        case -1: return `.send mo ${info.owner} "Предприятие" "${info.poi}" ${finalMod * (goldResourceProductivityByPOILevel.get(info.poiLevel) as number)}`//Золотые монеты
        case 1000069: return `.send it ${info.owner} "Предприятие" "${info.poi}" ${info.resource}:${Math.ceil(finalMod * (secondLevelResourceProductivityByPOILevel.get(info.poiLevel) as number))}`
        default: return `.send it ${info.owner} "Предприятие" "${info.poi}" ${info.resource}:${Math.ceil(finalMod * (firstLevelResourceProductivityByPOILevel.get(info.poiLevel) as number))}` // Ресурсы первого уровня
    }
}