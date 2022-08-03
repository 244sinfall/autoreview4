import React, {useState} from 'react';
import ContentTitle from "../../../components/static/contentTitle/contentTitle";
import TextAreaWritable from "../../../components/dynamic/textAreaWritable/textAreaWritable";
import TextInput from "../../../components/dynamic/textInput/textInput";
import NumberInput from "../../../components/dynamic/numberInput/numberInput";
import RadioButtonGroup from "../../../components/dynamic/radioButtonGroup/radioButtonGroup";
import {
    RewardWorker,
    RewardWorkerFields,
    RewardWorkerModes, RewardWorkerResponse,
    RewardWorkersModesToRequest} from "../../../model/arbiters/rewardWorker";
import ActionButton from "../../../components/static/actionButton/actionButton";
import {APIAddress, rewardsWorkEndPoint} from "../../../config/api";
import TextAreaReadOnly from "../../../components/dynamic/textAreaReadOnly/textAreaReadOnly";
import './rewardWorker.css'

const RewardWorkerComponent = () => {

    const [rewardWorkerRequest, setRewardWorkerRequest] = useState<RewardWorker>({
        participantsCleanedText: "",
        mode: null,
        rate: 0,
        eventLink: ""
    })
    const [rewardWorkerResponse, setRewardWorkerResponse] = useState("")
    const [errMsg, setErrMsg] = useState<string>("")
    const [textParted, setTextParted] = useState(false)
    const handleParticipantsText = (newValue: string) => {
        setRewardWorkerRequest({...rewardWorkerRequest, participantsCleanedText: newValue})
    }
    const handleModeChange = (newValue: string) => {
        switch (newValue) {
            case RewardWorkerModes.giveGold:
                if(rewardWorkerRequest.mode !== RewardWorkersModesToRequest.giveGold) {
                    setRewardWorkerRequest({...rewardWorkerRequest, mode: RewardWorkersModesToRequest.giveGold})
                }
                break
            case RewardWorkerModes.giveXP:
                if(rewardWorkerRequest.mode !== RewardWorkersModesToRequest.giveXP) {
                    setRewardWorkerRequest({...rewardWorkerRequest, mode: RewardWorkersModesToRequest.giveXP})
                }
                break
            case RewardWorkerModes.takeXP:
                if(rewardWorkerRequest.mode !== RewardWorkersModesToRequest.takeXP) {
                    setRewardWorkerRequest({...rewardWorkerRequest, mode: RewardWorkersModesToRequest.takeXP})
                }
                break
            default:
                break
        }
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
    async function runRewardWork() {
        if(rewardWorkerRequest.mode !== null &&
            rewardWorkerRequest.participantsCleanedText !== "" && rewardWorkerRequest.rate > 0 &&
            rewardWorkerRequest.eventLink !== "") {
            return await fetch(APIAddress + rewardsWorkEndPoint, {
                method: "POST",
                headers: {
                    "Accept": "application/json"
                },
                body: JSON.stringify(rewardWorkerRequest)
            })
                .then((response) => response.json())
                .then((json) =>  {
                    return json as RewardWorkerResponse
                })
                .then((parsedResponse) => {
                    let result = parsedResponse.commands
                    if (parsedResponse.participantsModified) {
                        result += "\n\nОшибки и внесенные изменения:\n" + parsedResponse.participantsModified
                    }
                    setRewardWorkerResponse(result)
                    setTextParted(false)

                } )
                .catch(() => {
                    setErrMsg("Ошибка сервера")
                    setTimeout(() => setErrMsg(""), 1500)
                })
        } else if (rewardWorkerRequest.mode === null) {
            setErrMsg("Не выбран режим")
            setTimeout(() => setErrMsg(""), 1500)
        } else if (rewardWorkerRequest.rate <= 0) {
            setErrMsg("Награда не положена")
            setTimeout(() => setErrMsg(""), 1500)
        } else if (rewardWorkerRequest.eventLink === "" || rewardWorkerRequest.participantsCleanedText === "") {
            setErrMsg("Поля не заполнены")
            setTimeout(() => setErrMsg(""), 1500)
        }
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
                    } else {
                        separateCounter = str.length
                        return "\n" + str
                    }
                }
                return str
            }).join("\n")
        })
        setTextParted(true)
    }
    return (
        <div className="rewardWorker">
            <ContentTitle title="Генерация макросов для выдачи/снятия наград">
                <div className="rewardWorker__container">
                    <div className="rewardWorker__options">
                        <NumberInput title={RewardWorkerFields.rate} minValue={0} maxValue={15} disabled={false} handler={handleFields}/>
                        <TextInput title={RewardWorkerFields.eventLink} placeholder={"https://rp-wow.ru/events/39237.html"} maxLength={128} handler={handleFields}/>
                        <RadioButtonGroup title={RewardWorkerFields.mode} handler={handleModeChange} options={[RewardWorkerModes.giveXP, RewardWorkerModes.takeXP, RewardWorkerModes.giveGold]} groupName={"rewardWorkerModeSelector"}/>
                        <p>Список участников:</p>
                        <TextAreaWritable height={400} recorder={handleParticipantsText}/>
                        <ActionButton title={errMsg ? errMsg : "Обработать"} show={true} action={runRewardWork} requiresLoading={true} tooltip={rules}/>
                    </div>
                    <div className="rewardWorker__result">
                        <p>Команды для выполнения в игре:</p>
                        <TextAreaReadOnly review={rewardWorkerResponse} height={700}/>
                        <ActionButton title="Разбить команды на макросы" show={!textParted && rewardWorkerResponse !== ""} action={splitCommandsToFitMacros} requiresLoading={false} tooltip={rulesMacro}/>
                    </div>
                </div>
            </ContentTitle>
        </div>
    );
};

export default RewardWorkerComponent;