import React, {useMemo, useRef} from 'react';
import ContentTitle from "../../common/content-title";
import NumberInput from "../../common/number-input";
import {
    LotteryCreatorImpl, LotteryRequest,
} from "../../../model/events/event-lottery";
import RadioButtonGroup from "../../common/radio-button-group";
import ActionButton from "../../common/action-button";
import TextArea from "../../common/text-area";
import Field from "../../common/field";
import './styles.css'

type LotteryProps = {
    buttonText: string,
    onSubmit: (info: LotteryRequest) => Promise<void>,
    result: string
}

const Lottery = (props: LotteryProps) => {
    const value = useRef<LotteryRequest>(LotteryCreatorImpl.defaultState)

    const rules = useMemo(() =>
        'Розыгрыш дополнительной награды в виде предметов предусмотрен<br/>' +
        'для событий, где участвовало минимум 10 человек (без ведущих,<br/>' +
        'наблюдателей, умерших и.т.д). Само событие для получения <br/>' +
        'дополнительной награды должно претендовать как минимум на <br/>' +
        'оценку 7. Подробнее в командном руководстве.<br/><br/>' +
        'Алгоритм "Больше предметов" проведет розыгрыш так, чтобы<br/>' +
        'награду получило как минимум 15% участников.<br/><br/>' +
        'Алгоритм "Выше качество" проведет розыгрыш так, чтобы выдать<br/>' +
        'более дорогие предметы без учета количества участников', [])

    return (
        <ContentTitle className="lottery" title='Подсчет розыгрыша предметов' collapsable={true}>
            <Field title="Оценка">
                <NumberInput minValue={0} maxValue={15} onChange={rate => value.current.rate = rate}/>
            </Field>
            <Field title="Количество участников">
                <NumberInput minValue={0} maxValue={1000} onChange={participants =>
                    value.current.participantsCount = participants}/>
            </Field>
            <Field title="Алгоритм розыгрыша">
                <RadioButtonGroup options={LotteryCreatorImpl.modesList} groupName="lottery-creator-mode"
                                  onSelectionChange={modeName =>
                                      value.current.qualityOverQuantityMode = LotteryCreatorImpl.modeValue[modeName]}/>
            </Field>
            <span className="lottery-trigger"><ActionButton title={props.buttonText}
                          onClick={() => props.onSubmit(value.current)}
                          tooltip={rules}/>
            </span>
            <TextArea className="lottery-result" value={props.result}/>
        </ContentTitle>
    );
};

export default React.memo(Lottery);