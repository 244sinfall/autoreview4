import React, {useMemo} from 'react';
import ContentTitle from "../../common/content-title";
import NumberInput from "../../common/number-input";
import TextInput from "../../common/text-input";
import RadioButtonGroup from "../../common/radio-button-group";
import ActionButton from "../../common/action-button";
import Field from "../../common/field";
import TextArea from "../../common/text-area";
import './styles.css'
import {
    RewardDistributionData,
    RewardDistributionMode,
    RewardDistributionModeList
} from "../../../model/arbiters/event-rewards/types";


type EventRewardMacroMakerProps = {
    buttonMessage: string,
    onSubmit: () => Promise<void>,
    onRateChange: (rate: number) => void,
    onModeChange: (mode: RewardDistributionMode) => void
    onEventLinkChange: (link: string) => void
    onTextChange: (text: string) => void
    onSplit: () => void,
    shouldSplit?: boolean
    info: RewardDistributionData
    result: string
}

const EventRewardMacroMaker = (props: EventRewardMacroMakerProps) => {
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
                             onChange={props.onRateChange}/>
                </Field>
                <Field className="event-reward-macro-maker__event-link" title="Ссылка на отчет" containerOptions={{direction: "column"}}>
                    <TextInput className="event-reward-macro-maker__event-link-input" placeholder={"https://rp-wow.ru/events/39237.html"}
                           maxLength={128} onChange={props.onEventLinkChange} value={props.info.eventLink}/>
                </Field>
                <Field title="Режим арбитража" containerOptions={{direction:"column"}}>
                    <RadioButtonGroup onSelectionChange={props.onModeChange} value={props.info.mode}
                                  options={RewardDistributionModeList}
                                  groupName={"event-reward-macro-mode"}/>
                </Field>
                <p>Список участников:</p>
                <TextArea className="event-reward-macro-maker__participants-input" onChange={props.onTextChange}
                          value={props.info.participantsCleanedText}/>
                <span className="event-reward-macro-maker__button"><ActionButton title={props.buttonMessage}
                              onClick={props.onSubmit}
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