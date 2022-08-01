export interface LotteryRequest {
    participantsCount: number,
    rate: number,
    qualityOverQuantityMode: boolean | null
}

export interface LotteryResponse {
    participantsCount: number,
    bankPerParticipant: number,
    bank: number,
    bankRemain: number,
    potentialWinners: number,
    lottery: LotteryObject
}

export interface LotteryObject {
    epic: number
    rare: number
    unusual: number
    usual: number
    low: number
}