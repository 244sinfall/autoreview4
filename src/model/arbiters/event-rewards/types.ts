export type RewardDistributionMode = "Выдача золота" | "Выдача опыта" | "Изъятие опыта"

export const RewardDistributionModeValue: Record<RewardDistributionMode, string> = {
    "Выдача золота": "givegold",
    "Выдача опыта": "givexp",
    "Изъятие опыта": "takexp"
}

export const RewardDistributionModeList: RewardDistributionMode[] = ["Выдача золота", "Выдача опыта", "Изъятие опыта"]

export type RewardDistributionResponse = {
    commands: string,
    participantsModified: string
}

export type RewardDistributionData = {
    eventLink: string,
    mode: RewardDistributionMode | undefined,
    participantsCleanedText: string,
    rate: number,
}

export type RewardDistributionState = RewardDistributionData & {
    error: string,
    result: string
}

const RewardDistributionDefaultState: RewardDistributionState = {
    eventLink: "",
    mode: undefined,
    participantsCleanedText: "",
    rate: 0,
    error: "",
    result: ""
}

export default RewardDistributionDefaultState