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

export enum RewardWorkersModesToRequest {
    giveXP = "givexp",
    takeXP = "takexp",
    giveGold = "givegold"
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