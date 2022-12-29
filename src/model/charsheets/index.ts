import {APIConfig} from "../../config/api";

export interface Rate {
    rateName: string,
    rateValue: number
}

export interface CharsheetReviewRequest {
    rates: Rate[],
    charName: string,
    reviewerProfile: string,
    reviewerDiscord: string
}

interface CharsheetReviewResponse {
    review: string
}

export default class CharsheetReviewTemplate implements CharsheetReviewRequest{
    charName: string;
    rates: Rate[];
    reviewerDiscord: string;
    reviewerProfile: string;
    static defaultState: CharsheetReviewRequest = {
        rates: [],
        charName: "",
        reviewerProfile: "",
        reviewerDiscord: "",
    }
    constructor(info: CharsheetReviewRequest) {
        this.charName = info.charName
        this.rates = info.rates
        this.reviewerDiscord = info.reviewerDiscord
        this.reviewerProfile = info.reviewerProfile
    }
    get totalRate() {
        let totalRate = 0
        this.rates.forEach((value) => totalRate += value.rateValue)
        return Math.floor(totalRate/this.rates.length)
    }
    async getReview() {
        if(!this.charName || !this.reviewerDiscord || !this.reviewerProfile) throw new Error("Поля не заполнены")
        const response = await fetch(`${APIConfig.address}${APIConfig.endpoints.charsheets.generate}`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify(Object.assign({}, this, {totalRate: this.totalRate}))
            })
        const json = await response.json()
        if(json['error']) throw new Error(json['error'])
        return (json as CharsheetReviewResponse).review
    }
}