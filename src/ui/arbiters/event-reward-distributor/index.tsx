import React, {useCallback, useState} from 'react';
import ContentTitle from "../../../components/static/content-title";
import TextAreaWritable from "../../../components/dynamic/text-area-writable";
import TextInput from "../../../components/dynamic/text-input";
import NumberInput from "../../../components/dynamic/number-input";
import RadioButtonGroup from "../../../components/dynamic/radio-button-group";
import {EventRewardDistributor, EventRewardDistributorImpl}
    from "../../../model/arbiters/event-reward-distributor";
import ActionButton from "../../../components/static/action-button";
import TextAreaReadOnly from "../../../components/dynamic/text-area-read-only";
import './style.css'

const EventRewardGiver = () => {
    const [rewardWorkerRequest, setRewardWorkerRequest] = useState<EventRewardDistributor>(EventRewardDistributorImpl.defaultState)
    const [rewardWorkerResponse, setRewardWorkerResponse] = useState("")
    const [errMsg, setErrMsg] = useState<string>("")
    const [isTextParted, setIsTextParted] = useState(false)

    const callbacks = {
        handleParticipantsText: useCallback((newValue: string) =>
            setRewardWorkerRequest({...rewardWorkerRequest, participantsCleanedText: newValue}),
            [rewardWorkerRequest]),
        handleModeChange: useCallback((newValue: string) => {
            setRewardWorkerRequest({...rewardWorkerRequest,
                mode: EventRewardDistributorImpl.modes.find(mode => mode.name === newValue) ?? null})
        }, [rewardWorkerRequest]),
        handleFields: useCallback((fieldName: string, fieldValue: string | number) => {
            switch (fieldName) {
                case "Оценка": setRewardWorkerRequest({...rewardWorkerRequest, rate: fieldValue as number}); break;
                case "Ссылка на отчет": setRewardWorkerRequest({...rewardWorkerRequest, eventLink: fieldValue as string})
            }
        }, [rewardWorkerRequest]),
        executeDistribution: useCallback(async() => {
            try {
                const distributor = new EventRewardDistributorImpl(rewardWorkerRequest)
                const response = await distributor.run()
                if (isTextParted) setIsTextParted(false)
                return setRewardWorkerResponse(response)
            } catch (e: any) {
                setErrMsg(e.message)
                setTimeout(() => setErrMsg(""), 1500)
            }
        }, [isTextParted, rewardWorkerRequest]),
        splitCommandsToFitMacro: useCallback(() => {
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
        }, [])
    }
    const rules = 'Обработать список и сгенерировать команды для<br/>' +
                    'выбранного режима. Вернет все, что было не выдано<br/>' +
                    'отдельным списком.'
    const rulesMacro = 'Разбить строки на группы длинною до 254 символов.<br/>' +
                        'Каждая такая группа гарантированно поместится в макрос.'
    return (
        <div className="reward-worker">
            <ContentTitle title="Генерация макросов для выдачи/снятия наград" controllable={true}>
                <div className="reward-worker__container">
                    <div className="reward-worker__options">
                        <NumberInput title="Оценка" minValue={0} maxValue={15} disabled={false}
                                     handler={callbacks.handleFields}/>
                        <TextInput title="Ссылка на отчет" placeholder={"https://rp-wow.ru/events/39237.html"}
                                   maxLength={128} handler={callbacks.handleFields}/>
                        <RadioButtonGroup title="Режим арбитража" handler={callbacks.handleModeChange}
                                          options={EventRewardDistributorImpl.modesList()}
                                          groupName={"rewardWorkerModeSelector"}/>
                        <p>Список участников:</p>
                        <TextAreaWritable height={400} handler={callbacks.handleParticipantsText}/>
                        <ActionButton title={errMsg ? errMsg : "Обработать"} show={true}
                                      action={callbacks.executeDistribution} requiresLoading={true} tooltip={rules}/>
                        <ActionButton title="Разбить команды на макросы"
                                      show={!isTextParted && rewardWorkerResponse !== ""}
                                      action={callbacks.splitCommandsToFitMacro} requiresLoading={false}
                                      tooltip={rulesMacro}/>
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

export default EventRewardGiver;