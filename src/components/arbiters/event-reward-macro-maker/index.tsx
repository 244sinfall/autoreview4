import React, {useMemo, useRef} from 'react';
import ContentTitle from "../../common/content-title";
import NumberInput from "../../common/number-input";
import TextInput from "../../common/text-input";
import RadioButtonGroup from "../../common/radio-button-group";
import {EventRewardDistributorImpl, EventRewardDistributor} from "../../../model/arbiters/event-reward-distributor";
import ActionButton from "../../common/action-button";
import Field from "../../common/field";
import TextArea from "../../common/text-area";
import './styles.css'


type EventRewardMacroMakerProps = {
    buttonMessage: string,
    onSubmit: (info: EventRewardDistributor) => Promise<void>,
    onSplit: () => void
    shouldSplit?: boolean
    result: string
}

const EventRewardMacroMaker = (props: EventRewardMacroMakerProps) => {
    const value = useRef<EventRewardDistributor>(EventRewardDistributorImpl.defaultState)
    const rules = useMemo(() => 'Обработать список и сгенерировать команды для<br/>' +
        'выбранного режима. Вернет все, что было не выдано<br/>' +
        'отдельным списком.', [])
    const rulesMacro = useMemo(() => 'Разбить строки на группы длинною до 254 символов.<br/>' +
        'Каждая такая группа гарантированно поместится в макрос.', [])
    return (
        <ContentTitle className="event-reward-macro-maker" title="Генерация макросов для выдачи/снятия наград" collapsable={true}>
            <div className="event-reward-macro-maker__options">
                <Field title="Оценка">
                    <NumberInput minValue={0} maxValue={15} disabled={false}
                             onChange={rate => value.current.rate = rate}/>
                </Field>
                <Field className="event-reward-macro-maker__event-link" title="Ссылка на отчет" containerOptions={{direction: "column"}}>
                    <TextInput className="event-reward-macro-maker__event-link-input" placeholder={"https://rp-wow.ru/events/39237.html"}
                           maxLength={128} onChange={link => value.current.eventLink = link}/>
                </Field>
                <Field title="Режим арбитража" containerOptions={{direction:"column"}}>
                    <RadioButtonGroup onSelectionChange={mode =>
                        value.current.mode = EventRewardDistributorImpl.modes[mode]}
                                  options={EventRewardDistributorImpl.modesList()}
                                  groupName={"event-reward-macro-mode"}/>
                </Field>
                <p>Список участников:</p>
                <TextArea className="event-reward-macro-maker__participants-input" onChange={text => value.current.participantsCleanedText = text}/>
                <span className="event-reward-macro-maker__button"><ActionButton title={props.buttonMessage}
                              onClick={() => props.onSubmit(value.current)}
                              tooltip={rules}/>
                </span>
                {props.shouldSplit && <ActionButton title="Разбить команды на макросы"
                              onClick={props.onSplit}
                              tooltip={rulesMacro}/>}
            </div>
            <div className="reward-worker__result">
                <p>Команды для выполнения в игре:</p>
                <TextArea className="event-reward-macro-maker__output" value={props.result} />
            </div>
        </ContentTitle>
    );
};

export default React.memo(EventRewardMacroMaker);