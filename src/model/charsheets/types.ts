export type Rate = {
    rateName: string,
    rateValue: number
}

export type CharsheetReviewRequest = {
    rates: Rate[],
    charName: string,
    reviewerProfile: string,
    reviewerDiscord: string,
    totalRate: number,
}

export type CharsheetReviewState = {
    info: CharsheetReviewRequest,
    error: string,
    result: string,
}

const DefaultCharsheetReviewState: CharsheetReviewState = {
    error: "",
    info: {
        rates: [
            {rateName: 'Содержательность', rateValue: 0},
            {rateName: 'Грамотность', rateValue: 0},
            {rateName: 'Логичность', rateValue: 0},
            {rateName: 'Каноничность', rateValue: 0},
        ],
        charName: "",
        reviewerDiscord: localStorage.getItem("discordProfile") ?? "",
        reviewerProfile: localStorage.getItem("profileLink") ?? "",
        totalRate: 0
    },
    result: ""
}

export default DefaultCharsheetReviewState
