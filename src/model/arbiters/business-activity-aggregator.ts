export interface BusinessRewardInfo {
    owner: string,
    poi: number,
    resource: number,
    poiLevel: number,
    labors: number,
    multiplier: number
}

enum ResourceType {
    UNDEFINED,
    FIRST,
    SECOND,
    GOLD
}

class BusinessRewardDistributor {
    resourceType = ResourceType.UNDEFINED
    private rewards = new Map([
        [ResourceType.FIRST, new Map([
            [0, 0],
            [1, 2.5],
            [2, 5],
            [3, 7.5],
            [4, 10],
            [5, 12.5],
            [6, 15],
            [7, 17.5]
        ])],
        [ResourceType.SECOND, new Map([
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 4],
            [5, 5],
            [6, 6],
            [7, 7]
        ])],
        [ResourceType.GOLD, new Map([
            [0, 0],
            [1, 10000],
            [2, 20000],
            [3, 30000],
            [4, 40000],
            [5, 50000],
            [6, 60000],
            [7, 70000]
        ])]
    ])
    constructor(resourceType: ResourceType) {
        this.resourceType = resourceType
    }
    getReward(level: number) {
        return this.rewards.get(this.resourceType)?.get(level) ?? 0
    }
}

interface Resource {
    name: string,
    type: ResourceType,
    id: number
}

export class BusinessActivityAggregator implements BusinessRewardInfo {
    multiplier: number;
    labors: number;
    owner: string;
    poi: number;
    poiLevel: number;
    resource: number;
    resourceObj() {
        return BusinessActivityAggregator.resources.find(res => res.id === this.resource) ?? BusinessActivityAggregator.resources[0]
    }
    static defaultState = {
        owner: "",
        poi: 0,
        resource: 0,
        poiLevel: 0,
        labors: 0,
        multiplier: 1
    }
    private static resources: Resource[] = [
        {name: "Выберите тип ресурса", type: ResourceType.UNDEFINED, id: 0},
        {name: "Руда", type: ResourceType.FIRST, id: 1000072},
        {name: "Камень", type: ResourceType.FIRST, id: 1000073},
        {name: "Провиант", type: ResourceType.FIRST, id: 1000074},
        {name: "Трава", type: ResourceType.FIRST, id: 1000071},
        {name: "Древесина", type: ResourceType.FIRST, id: 1000076},
        {name: "Рем. изделия", type: ResourceType.SECOND, id: 1000069},
        {name: "Золото", type: ResourceType.GOLD, id: -1}
    ]
    static resourcesList() {
        return BusinessActivityAggregator.resources.map(res => res.name)
    }
    static getResourceId(resource: string) {
        switch (resource) {
            case "Руда": return 1000072
            case "Камень": return 1000073
            case "Провиант": return 1000074
            case "Трава": return 1000071
            case "Древесина": return 1000076
            case "Рем. изделия": return 1000069
            case "Золото": return -1
            default: return 0
        }
    }
    constructor() {
        this.owner = ""
        this.poi = 0
        this.resource = 0
        this.poiLevel = 0
        this.labors = 0
        this.multiplier = 1
    }
    getCommand() {
        if(!this.labors || !this.poiLevel || !this.resource || !this.owner || !this.multiplier)
            throw new Error("Поля не заполнены")
        const finalMod = this.multiplier * this.labors
        const resource = this.resourceObj()
        const distributor = new BusinessRewardDistributor(resource.type)
        switch(resource.type) {
            case ResourceType.GOLD: return `.send mo ${this.owner} "Предприятие" ` +
            `"${this.poi}" ${Math.round(finalMod * distributor.getReward(this.poiLevel))}`

            case ResourceType.SECOND:
            case ResourceType.FIRST: return `.send it ${this.owner} "Предприятие" ` +
            `"${this.poi}" ${this.resource}:${Math.ceil(finalMod * distributor.getReward(this.poiLevel))}`
            default: throw new Error("Неизвестный тип ресурса")
        }
    }
    setInfo(info: BusinessRewardInfo) {
        this.owner = info.owner
        this.poi = info.poi
        this.resource = info.resource
        this.labors = info.labors
        this.poiLevel = info.poiLevel
        this.multiplier = info.multiplier
    }
}