import React, {useCallback, useState} from 'react';
import ContentTitle from "../../../components/static/content-title";
import ActionButton from "../../../components/static/action-button";
import TextAreaReadOnly from "../../../components/dynamic/text-area-read-only";
import NumberInput from "../../../components/dynamic/number-input";
import RadioButtonGroup from "../../../components/dynamic/radio-button-group";
import {
    createLottery,
    getLotteryItemCategoryName,
    getLotteryItemsPluralized,
    LotteryCreatorFields,
    LotteryRequest,
    LotteryResponse,
    QualityOverQuantityMode
} from "../../../model/events/event-lottery";
import './style.css'

const LotteryCreator = () => {
    const [lotteryRequest, setLotteryRequest] = useState<LotteryRequest>({
        participantsCount: 0,
        rate: 0,
        qualityOverQuantityMode: null
    })
    const [lotteryResponse, setLotteryResponse] = useState<LotteryResponse | null>(null)
    const [errMsg, setErrMsg] = useState("")
    const lotteryResponseText = useCallback(() => {
        if(lotteryResponse === null) return ""
        let prizesCount = 0
        Object.values(lotteryResponse.lottery).forEach((val) => prizesCount += val)
        let output = ""
        output += "Итоги розыгрыша:\n"
        output += `Количество участников: ${lotteryResponse.participantsCount}\n`
        output += `Количество золотых на одного участника: ${lotteryResponse.bankPerParticipant}\n`
        output += `Общий банк (золото): ${lotteryResponse.bank}\n`
        output += `Остаток после розыгрыша (золото): ${lotteryResponse.bankRemain}\n`
        output += `Потенциальных победителей: ${lotteryResponse.potentialWinners}\n`
        output += `Потенциальные победители, получившие награды: ${prizesCount}/${lotteryResponse.potentialWinners}\n`
        output += "\n\nК розыгрышу:\n"
        Object.entries(lotteryResponse.lottery).forEach((val) => {
            if (val[1] !== 0) {
                output += `${val[1]} ${getLotteryItemsPluralized(val[1])} ${getLotteryItemCategoryName(val[0])};\n`
            }
        })
        output += '\nЕсли вам не нравится результат, вы можете пересчитать награду иначе, нажав на кнопку розыгрыша снова или изменив алгоритм розыгрыша.'
        return output
    }, [lotteryResponse])
    function updateField(fieldName: string, fieldValue: number) {
        if(fieldName === LotteryCreatorFields.rate && lotteryRequest.rate !== fieldValue)
            setLotteryRequest({...lotteryRequest, rate: fieldValue})
        if(fieldName === LotteryCreatorFields.participants && lotteryRequest.participantsCount !== fieldValue)
            setLotteryRequest({...lotteryRequest, participantsCount: fieldValue})
    }
    function updateMode(modeValue: string) {
        if(modeValue === QualityOverQuantityMode.higherQuality)
            setLotteryRequest({...lotteryRequest, qualityOverQuantityMode: true})
        if(modeValue === QualityOverQuantityMode.moreItems)
            setLotteryRequest({...lotteryRequest, qualityOverQuantityMode: false})
    }
    const setError = (message: string) => {
        setErrMsg(message)
        setTimeout(() => setErrMsg(""), 1000)
    }
    const handleCreateLottery = () => {
        return createLottery(lotteryRequest)
            .then((response) => {
                if(response === undefined) throw Error("Ошибка ответа")
                setLotteryResponse(response)
            })
            .catch((e) => setError(e.message))
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
        <div className='lottery-creator'>
            <ContentTitle title='Подсчет розыгрыша предметов' controllable={true}>
                <div className='lottery-creator__container'>
                    <div className='lottery-creator__options'>
                        <NumberInput title={LotteryCreatorFields.rate} minValue={0} maxValue={15} disabled={false} handler={updateField}/>
                        <NumberInput title={LotteryCreatorFields.participants} minValue={0} maxValue={1000} disabled={false} handler={updateField}/>
                        <RadioButtonGroup title="Алгоритм розыгрыша" options={[QualityOverQuantityMode.moreItems, QualityOverQuantityMode.higherQuality]} groupName="qualityOverQuantitySelector" handler={updateMode}/>
                        <ActionButton title={errMsg ? errMsg : 'Разыграть'} show={true} action={handleCreateLottery} tooltip={rules} requiresLoading={true}/>
                    </div>
                    <TextAreaReadOnly content={lotteryResponseText()} height={250}></TextAreaReadOnly>
                </div>
            </ContentTitle>
        </div>
    );
};

export default LotteryCreator;