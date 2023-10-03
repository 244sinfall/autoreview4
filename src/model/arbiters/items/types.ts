import data from './data.json'
import qualities from './qualities.json'

type ArbiterItemInfoBase = {
    id: number,
    name: string,
}

type ArbiterItemInfoRaw = ArbiterItemInfoBase & {
    itemStatValue1: number,//Сила/стойкость
    itemStatValue2: number,//Ловкость/сноровка
    itemStatValue3: number,//Интеллект/воля/дух (для вещей с криптом)
    itemStatValue4: number//Дух/крит (для вещей с критом)
}

export type ArbiterItemInfo = ArbiterItemInfoBase & {
    description: string
    quality: string
}

export type ArbiterItemsState = {
    items: ArbiterItemInfo[]
    search: string,
    page: number,
    perPage: number
}
const hasQuality = ['Голова', 'Плечи', 'Грудь', 'Пояс', 'Ноги', 'Ступни','Запястья', 'Кисти рук', 'Плащ', 'Левая рука', 'Правая рука', 'Рубашка', 'Шея', 'Палец', 'Аксессуар'] as const
function getQuality(item: string) {
    const itemHeaders = hasQuality.filter(header => item.startsWith(header))
    if(itemHeaders.length === 0) {
        return '';
    }
    const itemHeader = itemHeaders[0];
    const regex = /\+(\d+)/;
    const qualityMatch = item.match(regex);
    if(!qualityMatch) {
        return '';
    }
    const qualityNumber = qualityMatch[1];

    if(Object.keys(qualities).includes(itemHeader) && Object.keys(qualities[itemHeader as keyof typeof qualities]).includes(qualityNumber)) {
        // @ts-ignore
        return qualities[itemHeader][qualityNumber]
    }
    return ''
}

function getDescription(item: ArbiterItemInfoRaw) {
    const itemHeaders = hasQuality.filter(header => item.name.startsWith(header))
    if(itemHeaders.length === 0) {
        return '';
    }
    const itemHeader = itemHeaders[0];
    switch(itemHeader){
        case "Голова":
        case "Плечи":
        case "Грудь":
        case "Пояс":
        case "Ноги":
        case "Ступни":
        case "Запястья":
        case "Кисти рук":
        case "Плащ":
            let result = '';
            if(item.itemStatValue1) {
                result += `+${item.itemStatValue1} Стойкость, `
            }
            if(item.itemStatValue2) {
                result += `+${item.itemStatValue2} Сноровка, `
            }
            if(item.itemStatValue3) {
                result += `+${item.itemStatValue3} Воля, `
            }
            if(item.itemStatValue4) {
                result += `+${item.itemStatValue4} Дух, `
            }
            return result.substring(0, result.length-2);
        case "Левая рука":
        case "Правая рука":
            let result2 = '';
            if(item.itemStatValue1) {
                result2 += `+${item.itemStatValue1} Сила, `
            }
            if(item.itemStatValue2) {
                result2 += `+${item.itemStatValue2} Ловкость, `
            }
            if(item.itemStatValue3) {
                result2 += `+${item.itemStatValue3} Интеллект, `
            }
            return result2.substring(0, result2.length-2);
        case "Аксессуар":
        case "Рубашка":
        case "Шея":
        case "Палец":
            let result3 = '';
            if(item.itemStatValue3) {
                result3 += `+${item.itemStatValue3} Дух, `
            }
            if(item.itemStatValue4) {
                result3 += `+${item.itemStatValue4} Критический шанс, `
            }
            return result3.substring(0, result3.length-2);
    }
}
const ArbiterItemsDefaultState: ArbiterItemsState = {
    items: data.map(entry =>
        ({
            id: entry.id,
            name: entry.name + (entry.description ? ` (${entry.description})`:``),
            quality: getQuality(entry.name),
            description: getDescription(entry)
        })),
    page: 1,
    perPage: 50,
    search: ''
}

export default ArbiterItemsDefaultState