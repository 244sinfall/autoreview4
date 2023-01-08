import APIConfig from "../../config/api";

export interface EventRewardDistributor {
    participantsCleanedText: string,
    mode: string | null,
    rate: number,
    eventLink: string
}

export class EventRewardDistributorImpl implements EventRewardDistributor {
    eventLink: string;
    mode: string | null;
    participantsCleanedText: string;
    rate: number;
    static defaultState = {
        participantsCleanedText: "",
        mode: null,
        rate: 0,
        eventLink: ""
    }
    static modes: Record<EventRewardDistributionModeName, string> = {
        "Выдача опыта": "givexp",
        "Изъятие опыта": "takexp",
        "Выдача золота": "givegold"
    }
    static modesList(): EventRewardDistributionModeName[] {
        return ["Выдача опыта", "Изъятие опыта", "Выдача золота"]
    }
    constructor() {
        this.eventLink = ""
        this.mode = null
        this.participantsCleanedText = ""
        this.rate = 0
    }
    setInfo(info: EventRewardDistributor) {
        this.eventLink = info.eventLink
        this.mode = info.mode
        this.participantsCleanedText = info.participantsCleanedText
        this.rate = info.rate
    }
    private getBody() {
        return JSON.stringify({
            eventLink: this.eventLink,
            mode: this.mode,
            participantsCleanedText: this.participantsCleanedText,
            rate: this.rate
        })
    }
    private responseToText(response: EventRewardDistributorResponse) {
        let result = response.commands
        if (response.participantsModified) {
            result += "\n\nОшибки и внесенные изменения:\n" + response.participantsModified
        }
        return result
    }
    async run() {
        if (this.mode === null) throw Error("Не выбран режим")
        if (this.rate <= 0) throw Error("Награда не положена")
        if (!this.eventLink || !this.participantsCleanedText) throw Error("Поля не заполнены")
        const response = await fetch(`${APIConfig.address}${APIConfig.endpoints.arbiters.rewardWork}`, {
            method: "POST",
            headers: {
                "Accept": "application/json"
            },
            body: this.getBody()
        })
        const parsedResponse = await response.json() as EventRewardDistributorResponse
        return this.responseToText(parsedResponse);
    }
}

type EventRewardDistributionModeName = "Выдача опыта" | "Изъятие опыта" | "Выдача золота"

export interface EventRewardDistributorResponse {
    commands: string,
    participantsModified: string
}