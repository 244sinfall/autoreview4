import React, {useMemo, useState} from 'react';
import ContentTitle from "../../common/content-title";
import LayoutGrid from "../../common/layouts/grid";
import Field from "../../common/field";
import NumberInput from "../../common/number-input";
import ActionButton from "../../common/action-button";
import TextArea from "../../common/text-area";
import './style.css'

export type PowerToNpcInput = {
    level: number,
    power: number,
}

type PowerToNpcProps = {
    onConvert: (info: PowerToNpcInput) => void
    convertedValue: string
}

const PowerToNpc = (props: PowerToNpcProps) => {
    const [value, setValue] = useState({level: 0, power: 0})
    const containerOptions = useMemo(() => ({collapsedOptions: {widthToCollapse: 450}}), [])
    return (
        <ContentTitle title="Перевести мощь в NPC" collapsable={true}>
            <LayoutGrid>
                <Field title="Уровень POI" containerOptions={containerOptions}>
                    <NumberInput onChange={(level) => setValue({...value, level})}
                                 minValue={0} value={value.level} maxValue={7}/>
                </Field>
                <Field title="Мощь" containerOptions={containerOptions}>
                    <NumberInput onChange={(power) => setValue({...value, power})}
                                 minValue={0} value={value.power}/>
                </Field>
                <ActionButton title="Конвертировать" onClick={() => props.onConvert(value)}/>
                <hr/>
                <TextArea value={props.convertedValue} readOnly={true} placeholder={"Вывод будет здесь"} className="power_to_npc_output"/>
            </LayoutGrid>
        </ContentTitle>
    );
};

export default React.memo(PowerToNpc);