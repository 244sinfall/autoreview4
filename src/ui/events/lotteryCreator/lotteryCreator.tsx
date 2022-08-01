import React, {useState} from 'react';
import ContentTitle from "../../../components/static/contentTitle/contentTitle";
import ActionButton from "../../../components/static/actionButton/actionButton";
import TextAreaReadOnly from "../../../components/dynamic/textAreaReadOnly/textAreaReadOnly";
import NumberInput from "../../../components/dynamic/numberInput/numberInput";
import RadioButtonGroup from "../../../components/dynamic/radioButtonGroup/radioButtonGroup";
import {APIAddress, createLotteryEndPoint} from "../../../config/api";
import {LotteryRequest, LotteryResponse} from "../../../model/events/eventLottery";
import './lotteryCreator.css'


enum qualityOverQuantityMode {
    moreItems = "Больше предметов",
    higherQuality = "Выше качество"
}

enum lotteryCreatorFields {
    rate = "Оценка",
    participants = "Количество участников"
}

function getItemsPluralized(n: number): string {
    n = Math.abs(n) % 100;
    let n1 = n % 10;
    if (n > 10 && n < 20) { return "предметов"; }
    if (n1 > 1 && n1 < 5) { return "предмета"; }
    if (n1 === 1) { return "предмет"; }
    return "предметов";
}
function getItemCategoryName(s: string): string {
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

function createLotteryResponseText(request: LotteryRequest, response: LotteryResponse): string {
    let prizesCount = 0
    Object.values(response.lottery).forEach((val) => prizesCount += val)
    let output = ""
    output += "Итоги розыгрыша:\n"
    output += `Оценка отчета: ${request.rate}\n`
    output += `Количество участников: ${response.participantsCount}\n`
    output += `Количество золотых на одного участника: ${response.bankPerParticipant}\n`
    output += `Общий банк (золото): ${response.bank}\n`
    output += `Остаток после розыгрыша (золото): ${response.bankRemain}\n`
    if(request.qualityOverQuantityMode) {
        if(prizesCount < response.potentialWinners) {
            output += `Количество игроков, не получащих награду в угоду более высокому качеству предметов: ${response.potentialWinners-prizesCount}\n`
        }
    }
    else {
        output += `Потенциальных победителей: ${response.potentialWinners}`
    }
    output += "\n\nК розыгрышу:\n"
    Object.entries(response.lottery).forEach((val) => {
        if (val[1] !== 0) {
            output += `${val[1]} ${getItemsPluralized(val[1])} ${getItemCategoryName(val[0])};\n`
        }
    })
    output += '\nЕсли вам не нравится результат, вы можете пересчитать награду иначе, нажав на кнопку розыгрыша снова или изменив алгоритм розыгрыша.'
    return output
}


const LotteryCreator = () => {
    const [lotteryRequest, setLotteryRequest] = useState<LotteryRequest>({
        participantsCount: 0,
        rate: 0,
        qualityOverQuantityMode: null
    })
    // const [lotteryResponse, setLotteryResponse] = useState<LotteryResponse | null>(null)
    const [lotteryResponseText, setLotteryResponseText] = useState("")
    const [buttonErrorText, setButtonErrorText] = useState("")

    function updateField(fieldName: string, fieldValue: number) {
        switch (fieldName) {
            case lotteryCreatorFields.rate:
                if(lotteryRequest.rate !== fieldValue) {
                    setLotteryRequest({...lotteryRequest, rate: fieldValue})
                }
                break
            case lotteryCreatorFields.participants:
                if(lotteryRequest.participantsCount !== fieldValue) {
                    setLotteryRequest({...lotteryRequest, participantsCount: fieldValue})
                }
                break
            default:
                return
        }
    }
    function updateMode(modeValue: string) {
        switch (modeValue) {
            case qualityOverQuantityMode.higherQuality:
                if(lotteryRequest.qualityOverQuantityMode === null || lotteryRequest.qualityOverQuantityMode === false) {
                    setLotteryRequest({...lotteryRequest, qualityOverQuantityMode: true})
                }
                break
            case qualityOverQuantityMode.moreItems:
                if(lotteryRequest.qualityOverQuantityMode === null || lotteryRequest.qualityOverQuantityMode === true) {
                    setLotteryRequest({...lotteryRequest, qualityOverQuantityMode: false})
                }
                break
            default:
                break
        }
        return
    }
    async function createLottery() {
        if(lotteryRequest.qualityOverQuantityMode !== null &&
        lotteryRequest.rate >= 7 && lotteryRequest.participantsCount >= 10) {
            return await fetch(APIAddress + createLotteryEndPoint, {
                method: "POST",
                headers: {
                    "Accept": "application/json"
                },
                body: JSON.stringify(lotteryRequest)
            })
                .then((response) => response.json())
                .then((json) =>  {
                    return json as LotteryResponse
                })
                .then((parsedResponse) => {
                    setLotteryResponseText(createLotteryResponseText(lotteryRequest, parsedResponse))

                } )
                .catch(() => {
                    setButtonErrorText("Ошибка сервера")
                    setTimeout(() => setButtonErrorText(""), 1500)
                })
        } else if (lotteryRequest.qualityOverQuantityMode === null) {
            setButtonErrorText("Не выбран алгоритм")
            setTimeout(() => setButtonErrorText(""), 1500)
        } else if (lotteryRequest.rate < 7) {
            setButtonErrorText("Слишком низкая оценка")
            setTimeout(() => setButtonErrorText(""), 1500)
        } else if (lotteryRequest.participantsCount < 10) {
            setButtonErrorText("Мало участников")
            setTimeout(() => setButtonErrorText(""), 1500)
        }
    }
    const rules =
        'Розыгрыш дополнительной награды в виде предметов предусмотрен<br/>' +
        'для событий, где участвовало минимум 10 человек (без ведущих,<br/>' +
        'наблюдателей, умерших и.т.д). Само событие для получения <br/>' +
        'дополнительной награды должно претендовать как минимум на <br/>' +
        'оценку 7. Подробнее в командном руководстве.<br/><br/>' +
        'Алгоритм "Больше предметов" проведет розыгрыш так, чтобы<br/>' +
        'награду получило как минимум 15% участников.<br/><br/>' +
        'Алгоритм "Выше качество" проведет розыгрыш так, чтобы выдать<br/>' +
        'более дорогие предметы без учета количества участников'

    return (
        <div>
            <ContentTitle title='Подсчет розыгрыша предметов'>
                <div className='lottery-creator__container'>
                    <div className='lottery_creator__options'>
                        <NumberInput title={lotteryCreatorFields.rate} minValue={0} maxValue={15} disabled={false} handler={updateField}/>
                        <NumberInput title={lotteryCreatorFields.participants} minValue={0} maxValue={1000} disabled={false} handler={updateField}/>
                        <RadioButtonGroup title="Алгоритм розыгрыша" options={[qualityOverQuantityMode.moreItems, qualityOverQuantityMode.higherQuality]} groupName="qualityOverQuantitySelector" handler={updateMode}/>
                        <ActionButton title={buttonErrorText ? buttonErrorText : 'Разыграть'} show={true} action={createLottery} tooltip={rules} requiresLoading={true}/>
                    </div>
                    <TextAreaReadOnly review={lotteryResponseText} height={300}></TextAreaReadOnly>
                </div>
            </ContentTitle>
        </div>
    );
};

export default LotteryCreator;