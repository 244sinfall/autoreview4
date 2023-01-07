export interface ClaimedItemMinimal {
    quality: string,
    name: string,
    link: string,
    owner: string,
    ownerProfile: string,
    reviewer: string,
    additionalInfo: string
}

export interface ClaimedItemInterface extends ClaimedItemMinimal {
    id: string,
    ownerProof: string,
    ownerProofLink: string,
    accepted: boolean,
    acceptor: string,
    addedAt: string | Date,
    acceptedAt: string | Date,
}

export interface ClaimedItemsTables {
    legendary: ClaimedItemInterface[]
    epic: ClaimedItemInterface[]
    rare: ClaimedItemInterface[]
    green: ClaimedItemInterface[]
    other: ClaimedItemInterface[]
}
export interface ClaimedItemsOperationsHandler {
    get: () => Promise<ClaimedItemsTables>
    update: (changes: ClaimedItemInterface) => Promise<void>,
    accept: (id: string) => Promise<void>
    del: (id: string) => Promise<void>,
    add: (item: Partial<ClaimedItemMinimal>) => Promise<void>
}

export const ClaimedItemsTablesOrder: Record<keyof ClaimedItemsTables, number> = {
    legendary: 0,
    epic: 1,
    rare: 2,
    green: 3,
    other: 4,
}

export const ClaimedItemTitles: Record<keyof ClaimedItemsTables, string> = {
    epic: "Предметы Эпического качества",
    green: "Предметы Необычного качества",
    legendary: "Предметы Легендарного качества",
    other: "Предметы Прочего качества",
    rare: "Предметы Редкого качества"
}

export const ClaimedItemQualityTitles: Record<keyof ClaimedItemsTables, string> = {
    epic: "Эпический",
    green: "Необычный",
    legendary: "Легендарный",
    other: "Прочее",
    rare: "Редкий"
}

export type ClaimedItemsState = {
    isLoading: boolean,
    error: string,
    content: ClaimedItemsTables
    page: Record<keyof ClaimedItemsTables, number>
    search: string,
    addModal: keyof ClaimedItemsTables | null,
    editModal: ClaimedItemInterface | null
}

export const DefaultClaimedItemPages: Record<keyof ClaimedItemsTables, number> = {
    legendary: 1,
    epic: 1,
    rare: 1,
    green: 1,
    other: 1,
}
export const DefaultClaimedItemState: ClaimedItemsState = {
    addModal: null,
    error: "",
    content: {
        legendary: [],
        epic: [],
        rare: [],
        green: [],
        other: [],
    },
    editModal: null,
    isLoading: false,
    page: DefaultClaimedItemPages,
    search: ""
}
