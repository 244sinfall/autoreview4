export type BusinessRewardInfo = {
    owner: string,
    poi: number,
    resource: number,
    poiLevel: number,
    labors: number,
    multiplier: number
}

type BusinessRewardState = {
    info: BusinessRewardInfo
    command: string
    error: string
}

export type BusinessResourceType = "First" | "Second" | "Gold"

export const BusinessRewardPerLabor: Record<BusinessResourceType, Record<number, number>> = {
    First: {
        1: 2.5,
        2: 5,
        3: 7.5,
        4: 10,
        5: 12.5,
        6: 15,
        7: 17.5
    },
    Second: {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7
    },
    Gold: {
        1: 10000,
        2: 20000,
        3: 30000,
        4: 40000,
        5: 50000,
        6: 60000,
        7: 70000
    },
}

const BusinessRewardDefaultState: BusinessRewardState = {
    info: {
        owner: "",
        poi: 0,
        resource: 0,
        poiLevel: 0,
        labors: 0,
        multiplier: 1,
    },
    command: "",
    error: ""
}
export default BusinessRewardDefaultState