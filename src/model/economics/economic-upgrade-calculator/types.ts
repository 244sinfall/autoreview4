export type NPCPurchaseMethod = "Золото" | "Прогресс" | "Провиант"

export type BuildingPurchaseMethod = "Ресурсы и золото" | "Ремесленные изделия" | "Прогресс"

export type PurchaseMethod = NPCPurchaseMethod | BuildingPurchaseMethod

export interface PurchaseArguments {
    level: number
}

export interface BuildingPurchaseArguments extends PurchaseArguments {
    modifier: number,
}

export type WithUpgradeArgument<T extends PurchaseArguments> = T & {
    upgradeTo: number
}

export type CalculationFieldsProps<T extends PurchaseArguments> = {
    onUpdate: (newArgs: T) => void
    defaults: T
}

export interface NpcPurchaseArguments extends PurchaseArguments {
    amount: number,
}

export const CalculationPropName: Record<keyof CalculationResult, string> = {
    food: "Поставки 'Провиант'",
    progress: "Прогресс",
    gold: "Золото",
    ore: "Поставки 'Руда'",
    stone: "Поставки 'Камень'",
    tools: "Ремесленные изделия",
    wood: "Поставки 'Дерево'",
}

export interface EconomicalCalculator<T extends PurchaseArguments, U extends PurchaseMethod> {
    calculate(data: T, payMethod: U): CalculationResult
    getPayMethods(): U[]
    getCalculationTitle(data: T): string
    getRelativeComponent(): (props: CalculationFieldsProps<T>) => JSX.Element
    defaults(): T
}

export interface CalculationResult {
    gold?: number,
    wood?: number,
    stone?: number,
    ore?: number,
    food?: number,
    tools?: number,
    progress?: number
}