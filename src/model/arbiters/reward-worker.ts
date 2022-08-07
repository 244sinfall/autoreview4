export interface RewardWorker {
    participantsCleanedText: string,
    mode: RewardWorkersModesToRequest | null,
    rate: number,
    eventLink: string
}

export enum RewardWorkerFields {
    eventLink = "Ссылка на отчет",
    rate = "Оценка отчета",
    mode = "Режим арбитража"
}

export enum RewardWorkersModesToRequestLabels {
    giveXP = "Выдача опыта",
    takeXP = "Изъятие опыта",
    giveGold = "Выдача золота"
}


export enum RewardWorkersModesToRequest {
    giveXP = "givexp",
    takeXP = "takexp",
    giveGold = "givegold"
}

export function convertRewardWorkerModeForAPI(mode: RewardWorkersModesToRequestLabels): RewardWorkersModesToRequest | null {
    switch(mode) {
        case RewardWorkersModesToRequestLabels.giveXP:
            return RewardWorkersModesToRequest.giveXP
        case RewardWorkersModesToRequestLabels.takeXP:
            return RewardWorkersModesToRequest.takeXP
        case RewardWorkersModesToRequestLabels.giveGold:
            return RewardWorkersModesToRequest.giveGold
        default:
            return null
    }
}

export enum RewardWorkerModes {
    giveXP = "Выдача опыта",
    takeXP = "Изъятие опыта",
    giveGold = "Выдача золота"
}

export interface RewardWorkerResponse {
    commands: string,
    participantsModified: string
}