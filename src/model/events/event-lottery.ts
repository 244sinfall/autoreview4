import {APIConfig} from "../../config/api";

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

export type LotteryMode = "Больше предметов" | "Выше качество"

export interface LotteryObject {
    epic: number
    rare: number
    unusual: number
    usual: number
    low: number
}

export class LotteryCreatorImpl implements LotteryRequest {
    static defaultState: LotteryRequest = {
        participantsCount: 0,
        qualityOverQuantityMode: null,
        rate: 0
    }
    static modesList: LotteryMode[] = ["Больше предметов", "Выше качество"]
    static modeValue: Record<LotteryMode, boolean> = {
        "Больше предметов": false,
        "Выше качество": true
    }
    participantsCount: number;
    qualityOverQuantityMode: boolean | null;
    rate: number;
    constructor() {
        this.participantsCount = 0;
        this.qualityOverQuantityMode = null;
        this.rate = 0;
    }
    setInfo(info: LotteryRequest) {
        this.participantsCount = info.participantsCount
        this.qualityOverQuantityMode = info.qualityOverQuantityMode
        this.rate = info.rate
    }
    private getPluralizedItems(n: number): string {
        n = Math.abs(n) % 100;
        let n1 = n % 10;
        if (n > 10 && n < 20) { return "предметов"; }
        if (n1 > 1 && n1 < 5) { return "предмета"; }
        if (n1 === 1) { return "предмет"; }
        return "предметов";
    }
    private isResponse(json: unknown): json is LotteryResponse {
        return typeof json === "object" && json != null && 'lottery' in json
    }
    private itemCategoryName: Record<keyof LotteryObject, string> = {
        epic: "эпического",
        rare: "редкого",
        unusual: "необычного",
        usual: "обычного",
        low: "низкого"
    }
    private responseToText(lotteryResponse: LotteryResponse): string {
        let prizesCount = Object.values(lotteryResponse.lottery).reduce((acc, curr) => acc + curr, 0);
        let output =
            `Итоги розыгрыша:\nКоличество участников: ${lotteryResponse.participantsCount}
Количество золотых на одного участника: ${lotteryResponse.bankPerParticipant}
Общий банк (золото): ${lotteryResponse.bank}
Остаток после розыгрыша (золото): ${lotteryResponse.bankRemain}
Потенциальных победителей: ${lotteryResponse.potentialWinners}
Потенциальные победители, получившие награды: ${prizesCount}/${lotteryResponse.potentialWinners}
\n\nК розыгрышу:\n`
        Object.entries(lotteryResponse.lottery).forEach((val) => {
            const itemQuality = val[0] as keyof LotteryObject
            const itemAmount = val[1] as number
            if (val[1] !== 0) {
                output += `${itemAmount} ${this.getPluralizedItems(itemAmount)} ${this.itemCategoryName[itemQuality]} качества;\n`
            }
        })
        output += '\nЕсли вам не нравится результат, вы можете пересчитать награду иначе, нажав на кнопку розыгрыша снова или изменив алгоритм розыгрыша.'
        return output
    }

    async run() {
        if(this.qualityOverQuantityMode === null) throw new Error('Не выбран алгоритм')
        if(this.rate < 7) throw new Error("Низкая оценка")
        if(this.participantsCount < 10) throw new Error("Мало участников")

        const response = await fetch(`${APIConfig.address}${APIConfig.endpoints.events.createLottery}`, {
            method: "POST",
            headers: {
                "Accept": "application/json"
            },
            body: JSON.stringify(this)
        })
        const json: unknown = await response.json()
        if(this.isResponse(json)) return this.responseToText(json)
        throw new Error("Неизвестный ответ от сервера")
    }
}