import React, {useCallback, useMemo} from 'react';
import ContentTitle from "../../common/content-title";
import TextInput from "../../common/text-input";
import NumberInput from "../../common/number-input";
import Selector from "../../common/selector";
import {BusinessRewardInfo} from "../../../model/arbiters/business/types";
import ActionButton from "../../common/action-button";
import './styles.css'
import Field from "../../common/field";
import Resources from '../../../model/arbiters/business/resources'

type BusinessRewardProps = {
    onSubmit: () => void
    onChange: <K extends keyof BusinessRewardInfo, V extends BusinessRewardInfo[K]>(key: K, value: V) => void
    info: BusinessRewardInfo
    result: string
    buttonText: string
}

const BusinessReward = (props: BusinessRewardProps) => {
    const callbacks = {
        onCopy: useCallback(() => props.result && navigator.clipboard.writeText(props.result), [props.result]),
    }
    const collapsedOptions = useMemo(() => ({
        widthToCollapse: 450,
        direction: "column"
    } as const), [])
    return (
        <ContentTitle className="business-reward" title="Активность предприятий" collapsable={true}>
            <Field title="Владелец" containerOptions={{collapsedOptions}}>
                <TextInput placeholder="Васян"
                           maxLength={64}
                           value={props.info.owner}
                           onChange={(owner) => props.onChange("owner", owner)}/>
            </Field>
            <Field title="Номер POI" containerOptions={{collapsedOptions}}>
                <NumberInput placeholder={8715}
                             maxValue={999999}
                             value={props.info.poi}
                             onChange={(poi) => props.onChange("poi", poi)}/>
            </Field>
            <span className="business-reward__multiplier">
                <Field title="Множитель награды">
                    <NumberInput className="business-reward__multiplier-input"
                                 minValue={0}
                                 maxValue={100}
                                 onChange={(multiplier) => props.onChange("multiplier", multiplier)}
                                 value={props.info.multiplier}
                                 isFloat={true}/>
                </Field>
                <Selector options={Resources.map(res => res.name)}
                          onSelectionChange={(resName) =>
                              props.onChange("resource", Resources.find(res => res.name === resName)?.id ?? 0)}/>
            </span>
            <Field title="Уровень POI" containerOptions={{collapsedOptions}}>
                <NumberInput minValue={0}
                             maxValue={7}
                             value={props.info.poiLevel}
                             onChange={(poiLevel) => props.onChange("poiLevel", poiLevel)}/>
            </Field>
            <Field title="Количество рабочих" containerOptions={{collapsedOptions}}>
                <NumberInput minValue={0}
                             maxValue={9999}
                             value={props.info.labors}
                             onChange={(labors) => props.onChange("labors", labors)}/>
            </Field>
            <span className="business-reward__button">
                <ActionButton title={props.buttonText} onClick={() => props.onSubmit()}/>
            </span>
            <Field className="business-reward__output-field" title="Вывод" containerOptions={{direction: "column"}}>
                <TextInput className="business-reward__output-input" placeholder="Здесь будет вывод" maxLength={1024} value={props.result}/>
            </Field>
            <span className="business-reward__button">
                <ActionButton title="Скопировать" onClick={callbacks.onCopy}/>
            </span>
        </ContentTitle>
    );
};

export default React.memo(BusinessReward);