import React, {useState} from 'react';
import ContentTitle from "../../../components/static/content-title";
import TextAreaWritable from "../../../components/dynamic/text-area-writable";
import TextInput from "../../../components/dynamic/text-input";
import NumberInput from "../../../components/dynamic/number-input";
import RadioButtonGroup from "../../../components/dynamic/radio-button-group";
import {
    convertRewardWorkerModeForAPI,
    RewardWorker,
    RewardWorkerFields,
    RewardWorkerModes, RewardWorkerResponse,
    RewardWorkersModesToRequestLabels
} from "../../../model/arbiters/reward-worker";
import ActionButton from "../../../components/static/action-button";
import {APIAddress, rewardsWorkEndPoint} from "../../../config/api";
import TextAreaReadOnly from "../../../components/dynamic/text-area-read-only";
import './style.css'

const RewardWorkerComponent = () => {

    const [rewardWorkerRequest, setRewardWorkerRequest] = useState<RewardWorker>({
        participantsCleanedText: "",
        mode: null,
        rate: 0,
        eventLink: ""
    })
    const [rewardWorkerResponse, setRewardWorkerResponse] = useState("")
    const [errMsg, setErrMsg] = useState<string>("")
    const [isTextParted, setIsTextParted] = useState(false)
    const handleParticipantsText = (newValue: string) =>
        setRewardWorkerRequest({...rewardWorkerRequest, participantsCleanedText: newValue})
    const handleModeChange = (newValue: string) => {
        if (Object.values(RewardWorkersModesToRequestLabels).includes(newValue as RewardWorkersModesToRequestLabels))
            setRewardWorkerRequest({...rewardWorkerRequest,
                mode: convertRewardWorkerModeForAPI(newValue as RewardWorkersModesToRequestLabels)})
    }
    const handleFields = (fieldName: string, fieldValue: string | number) => {
        switch (fieldName) {
            case RewardWorkerFields.rate:
                if(typeof fieldValue === "number" && rewardWorkerRequest.rate !== fieldValue) {
                    setRewardWorkerRequest({...rewardWorkerRequest, rate: fieldValue})
                }
                break
            case RewardWorkerFields.eventLink:
                if(typeof fieldValue === "string" && rewardWorkerRequest.eventLink !== fieldValue) {
                    setRewardWorkerRequest({...rewardWorkerRequest, eventLink: fieldValue})
                }
                break
            default:
                break
        }
    }
    const setErrMsgWithDelay = (err: string) => {
        setErrMsg(err)
        setTimeout(() => setErrMsg(""), 1500)
    }
    async function runRewardWork() {
        if (rewardWorkerRequest.mode === null)
            return setErrMsgWithDelay("Не выбран режим")
        if (rewardWorkerRequest.rate <= 0)
            return setErrMsgWithDelay("Награда не положена")
        if (rewardWorkerRequest.eventLink === "" || rewardWorkerRequest.participantsCleanedText === "")
            return setErrMsgWithDelay("Поля не заполнены")
        return await fetch(APIAddress + rewardsWorkEndPoint, {
            method: "POST",
            headers: {
                "Accept": "application/json"
            },
            body: JSON.stringify(rewardWorkerRequest)})
            .then(response => response.json())
            .then(json => json as RewardWorkerResponse)
            .then((parsedResponse) => {
                let result = parsedResponse.commands
                if (parsedResponse.participantsModified) {
                    result += "\n\nОшибки и внесенные изменения:\n" + parsedResponse.participantsModified
                }
                setRewardWorkerResponse(result)
                if (isTextParted) setIsTextParted(false)
            })
            .catch(() => setErrMsgWithDelay("Ошибка сервера"))
    }
    const rules = 'Обработать список и сгенерировать команды для<br/>' +
                    'выбранного режима. Вернет все, что было не выдано<br/>' +
                    'отдельным списком.'
    const rulesMacro = 'Разбить строки на группы длинною до 254 символов.<br/>' +
                        'Каждая такая группа гарантированно поместится в макрос.'
    const splitCommandsToFitMacros = () => {
        setRewardWorkerResponse((prevState) => {
            let separateCounter = 0
            return prevState.split("\n").map((str) => {
                if (str.startsWith(".")) {
                    if (separateCounter + str.length <= 254) {
                        separateCounter += str.length
                        return str
                    }
                    separateCounter = str.length
                    return "\n" + str
                }
                return str
            }).join("\n")
        })
        setIsTextParted(true)
    }
    return (
        <div className="reward-worker">
            <ContentTitle title="Генерация макросов для выдачи/снятия наград">
                <div className="reward-worker__container">
                    <div className="reward-worker__options">
                        <NumberInput title={RewardWorkerFields.rate} minValue={0} maxValue={15} disabled={false} handler={handleFields}/>
                        <TextInput title={RewardWorkerFields.eventLink} placeholder={"https://rp-wow.ru/events/39237.html"} maxLength={128} handler={handleFields}/>
                        <RadioButtonGroup title={RewardWorkerFields.mode} handler={handleModeChange} options={[RewardWorkerModes.giveXP, RewardWorkerModes.takeXP, RewardWorkerModes.giveGold]} groupName={"rewardWorkerModeSelector"}/>
                        <p>Список участников:</p>
                        <TextAreaWritable height={400} handler={handleParticipantsText}/>
                        <ActionButton title={errMsg ? errMsg : "Обработать"} show={true} action={runRewardWork} requiresLoading={true} tooltip={rules}/>
                        <ActionButton title="Разбить команды на макросы" show={!isTextParted && rewardWorkerResponse !== ""} action={splitCommandsToFitMacros} requiresLoading={false} tooltip={rulesMacro}/>
                    </div>
                    <div className="reward-worker__result">
                        <p>Команды для выполнения в игре:</p>
                        <TextAreaReadOnly content={rewardWorkerResponse} height={700}/>
                    </div>
                </div>
            </ContentTitle>
        </div>
    );
};

export default RewardWorkerComponent;