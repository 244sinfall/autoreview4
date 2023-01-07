import {APIConfig} from "../../config/api";

export interface Rate {
    rateName: string,
    rateValue: number
}

export interface CharsheetReviewRequest {
    rates: Rate[],
    charName: string,
    reviewerProfile: string,
    reviewerDiscord: string,
    totalRate: number,
}

interface CharsheetReviewResponse {
    review: string
}

export default class CharsheetReviewTemplate implements CharsheetReviewRequest{
    charName: string;
    rates: Rate[];
    reviewerDiscord: string;
    reviewerProfile: string;
    totalRate: number;
    static defaultState: CharsheetReviewRequest = {
        rates: [
            {rateName: 'Содержательность', rateValue: 0},
            {rateName: 'Грамотность', rateValue: 0},
            {rateName: 'Логичность', rateValue: 0},
            {rateName: 'Каноничность', rateValue: 0},
        ],
        charName: "",
        reviewerProfile: localStorage.getItem("profileLink") ?? "",
        reviewerDiscord: localStorage.getItem("discordProfile") ?? "",
        totalRate: 0
    }
    constructor(info: CharsheetReviewRequest) {
        this.charName = info.charName
        this.rates = info.rates
        this.reviewerDiscord = info.reviewerDiscord
        this.reviewerProfile = info.reviewerProfile
        this.totalRate = info.totalRate
    }
    private isReview(response: unknown): response is CharsheetReviewResponse {
        return typeof response === "object" && response != null && "review" in response;
    }
    private isError(response: unknown): response is { error: string } {
        return typeof response === "object" && response != null && "error" in response;
    }
    async getReview() {
        if(!this.charName || !this.reviewerDiscord || !this.reviewerProfile) throw new Error("Поля не заполнены")
        const response = await fetch(`${APIConfig.address}${APIConfig.endpoints.charsheets.generate}`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify(this)
            })
        const json: unknown = await response.json()
        if(this.isReview(json)) return json.review;
        if(this.isError(json)) throw new Error(json.error)
        return ""
    }


}