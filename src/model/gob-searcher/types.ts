export type GameObjectType = 0 | 1 | 2

export type GameObjectTypeName = "Стандартная ГО" | "M2" | "WMO"

export type GameObjectTypeFilter = "Все" | GameObjectTypeName

export const GameObjectTypeFilterOptions: GameObjectTypeFilter[] = ["Все", "Стандартная ГО", "M2", "WMO"]

export const GameObjectTypeToName: Record<GameObjectType, GameObjectTypeName> = {
    "0": "Стандартная ГО",
    "1": "M2",
    "2": "WMO"
}

export const GameObjectNameToType: Record<GameObjectTypeName, number> = {
    "Стандартная ГО": 0,
    "M2": 1,
    "WMO": 2,
}

export type GameObject = {
    id: number,
    name: string,
    type: GameObjectType
}

export type GobSearcherState = {
    items: GameObject[],
    search: string,
    typeFilter: GameObjectTypeFilter
    isLoading: boolean
    error: string
    page: number,
}

const GobSearcherDefaultState: GobSearcherState = {
    items: [],
    search: "",
    typeFilter: "Все",
    isLoading: false,
    error: "",
    page: 1,
}

export default GobSearcherDefaultState