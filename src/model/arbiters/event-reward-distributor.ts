import {APIConfig} from "../../config/api";

export interface EventRewardDistributor {
    participantsCleanedText: string,
    mode: EventRewardDistributionMode | null,
    rate: number,
    eventLink: string
}

export class EventRewardDistributorImpl implements EventRewardDistributor {
    eventLink: string;
    mode: EventRewardDistributionMode | null;
    participantsCleanedText: string;
    rate: number;
    static defaultState = {
        participantsCleanedText: "",
        mode: null,
        rate: 0,
        eventLink: ""
    }
    static modes: EventRewardDistributionMode[] = [
        {name: "Выдача опыта", command: "givexp"},
        {name: "Изъятие опыта", command: "takexp"},
        {name: "Выдача золота", command: "givegold"}
    ]
    static modesList() {
        return EventRewardDistributorImpl.modes.map(mode => mode.name)
    }
    constructor(fields: EventRewardDistributor) {
        this.eventLink = fields.eventLink
        this.mode = fields.mode
        this.participantsCleanedText = fields.participantsCleanedText
        this.rate = fields.rate
    }
    private getBody() {
        return JSON.stringify({
            eventLink: this.eventLink,
            mode: this.mode?.command ?? "",
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
        const response = await fetch(APIConfig.address + (APIConfig.endpoints.arbiters.rewardWork ?? ""), {
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

interface EventRewardDistributionMode {
    name: string,
    command: string,
}

export interface EventRewardDistributorResponse {
    commands: string,
    participantsModified: string
}