import React, {useCallback, useMemo, useState} from 'react';
import ContentTitle from "../../common/content-title";
import TextInput from "../../common/text-input";
import NumberInput from "../../common/number-input";
import Selector from "../../common/selector";
import {BusinessActivityAggregator, BusinessRewardInfo} from "../../../model/arbiters/business-activity-aggregator";
import ActionButton from "../../common/action-button";
import './styles.css'
import Field from "../../common/field";

type BusinessRewardProps = {
    onSubmit: (info: BusinessRewardInfo) => void
    result: string
    buttonText: string
}

const BusinessReward = (props: BusinessRewardProps) => {
    const [info, setInfo] = useState<BusinessRewardInfo>(BusinessActivityAggregator.defaultState)
    const callbacks = {
        onCopy: useCallback(() => props.result && navigator.clipboard.writeText(props.result), [props.result]),
        onChange: useCallback(<K extends keyof BusinessRewardInfo, V extends BusinessRewardInfo[K]>(key: K, value: V) => {
            setInfo(prev => ({...prev, [key]: value}))
        }, [])
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
                           value={info.owner}
                           onChange={(owner) => callbacks.onChange("owner", owner)}/>
            </Field>
            <Field title="Номер POI" containerOptions={{collapsedOptions}}>
                <NumberInput placeholder={8715}
                             maxValue={999999}
                             value={info.poi}
                             onChange={(poi) => callbacks.onChange("poi", poi)}/>
            </Field>
            <span className="business-reward__multiplier">
                <Field title="Множитель награды">
                    <NumberInput className="business-reward__multiplier-input"
                                 minValue={0}
                                 maxValue={100}
                                 onChange={(multiplier) => callbacks.onChange("multiplier", multiplier)}
                                 value={info.multiplier}
                                 isFloat={true}/>
                </Field>
                <Selector options={BusinessActivityAggregator.resourcesList()}
                          onSelectionChange={(resName) => 
                              callbacks.onChange("resource", BusinessActivityAggregator.getResourceId(resName))}/>
            </span>
            <Field title="Уровень POI" containerOptions={{collapsedOptions}}>
                <NumberInput minValue={0}
                             maxValue={7}
                             value={info.poiLevel}
                             onChange={(poiLevel) => callbacks.onChange("poiLevel", poiLevel)}/>
            </Field>
            <Field title="Количество рабочих" containerOptions={{collapsedOptions}}>
                <NumberInput minValue={0}
                             maxValue={9999}
                             value={info.labors}
                             onChange={(labors) => callbacks.onChange("labors", labors)}/>
            </Field>
            <span className="business-reward__button">
                <ActionButton title={props.buttonText} onClick={() => props.onSubmit(info)}/>
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