import {APIAddress, createLotteryEndPoint} from "../../config/api";

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

export enum QualityOverQuantityMode {
    moreItems = "Больше предметов",
    higherQuality = "Выше качество"
}

export enum LotteryCreatorFields {
    rate = "Оценка",
    participants = "Количество участников"
}

export function getLotteryItemsPluralized(n: number): string {
    n = Math.abs(n) % 100;
    let n1 = n % 10;
    if (n > 10 && n < 20) { return "предметов"; }
    if (n1 > 1 && n1 < 5) { return "предмета"; }
    if (n1 === 1) { return "предмет"; }
    return "предметов";
}

export function getLotteryItemCategoryName(s: string): string {
    switch (s) {
        case "epic":
            return "эпического качества"
        case "rare":
            return "редкого качества"
        case "unusual":
            return "необычного качества"
        case "usual":
            return "обычного качества"
        case "low":
            return "низкого качества"
        default:
            return "неизвестного качества"
    }
}

export async function createLottery(request: LotteryRequest) {
    if(request.qualityOverQuantityMode !== null &&
        request.rate >= 7 && request.participantsCount >= 10) {
        return await fetch(APIAddress + createLotteryEndPoint, {
            method: "POST",
            headers: {
                "Accept": "application/json"
            },
            body: JSON.stringify(request)
        })
            .then((response) => response.json())
            .then((json) => {
                if(json['error']) throw Error(json['error'])
                return json as LotteryResponse
            })
    } else if (request.qualityOverQuantityMode === null)
        throw Error('Не выбран алгоритм')
      else if (request.rate < 7)
        throw Error('Низкая оценка')
      else if (request.participantsCount < 10)
        throw Error('Мало участников')
}