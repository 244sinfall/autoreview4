import React, {useCallback, useState} from 'react';
import ContentTitle from "../../../components/static/content-title";
import TextInput from "../../../components/dynamic/text-input";
import NumberInput from "../../../components/dynamic/number-input";
import ActionButton from "../../../components/static/action-button";
import Selector from "../../../components/dynamic/selector";
import './style.css'
import {BusinessActivityAggregator, BusinessRewardInfo} from "../../../model/arbiters/business-activity-aggregator";

const BusinessRewarder = () => {
    const [businessInfo, setBusinessInfo] = useState<BusinessRewardInfo>(BusinessActivityAggregator.defaultState)
    const [currentCommand, setCurrentCommand] = useState("")
    const [copied, setCopied] = useState(false)
    const callbacks = {
        handleMultiplier: useCallback((fieldName: string, fieldValue: number) => {
            setBusinessInfo({...businessInfo, multiplier: fieldValue})
        }, [businessInfo]),
        textFieldChange: useCallback((fieldName: string, fieldValue: string) => {
            switch (fieldName) {
                case "Владелец": return setBusinessInfo({...businessInfo, owner: fieldValue})
                case "Номер POI": return setBusinessInfo({...businessInfo, poi: fieldValue})
            }
        }, [businessInfo]),

        selectorValueChange: useCallback((newValue: string) => setBusinessInfo({...businessInfo, 
            resource: BusinessActivityAggregator.getResourceId(newValue)}), [businessInfo]),

        numericFieldChange: useCallback((fieldName: string, fieldValue: number) => {
            switch (fieldName) {
                case "Уровень POI": return setBusinessInfo({...businessInfo, poiLevel: fieldValue})
                case "Количество рабочих": return setBusinessInfo({...businessInfo, labors: fieldValue})
            }
        }, [businessInfo]),

        createCommand: useCallback(() => {
            const aggregator = new BusinessActivityAggregator()
            aggregator.setInfo(businessInfo)
            setCurrentCommand(aggregator.getCommand())
        }, [businessInfo]),

        copy: useCallback(() => {
            setCopied(true)
            navigator.clipboard.writeText(currentCommand)
                .then(() => {
                    setTimeout(() => setCopied(false), 1000)
                })
        }, [currentCommand])
    }
    return (
        <div className="business-rewarder">
            <ContentTitle title="Активность предприятий" controllable={true}>
                <div className="business-rewarder__selectors">
                    <TextInput title="Владелец" placeholder="Васян" maxLength={64} handler={callbacks.textFieldChange}/>
                    <TextInput title="Номер POI" placeholder="8715" maxLength={8} handler={callbacks.textFieldChange}/>
                    <span className="business-rewarder__multiplier-resource">
                        <NumberInput title="Множитель награды" minValue={0} maxValue={100} disabled={false}
                                     handler={callbacks.handleMultiplier} floatable={true}/>
                        <Selector options={BusinessActivityAggregator.resourcesList()} changeHandler={callbacks.selectorValueChange} selected={"Выберите тип ресурса"}/>
                    </span>
                    <NumberInput title="Уровень POI" minValue={0} maxValue={7} disabled={false} handler={callbacks.numericFieldChange}/>
                    <NumberInput title="Количество рабочих" minValue={0} maxValue={9999} disabled={false} handler={callbacks.numericFieldChange}/>
                </div>
                <div className="business-rewarder__trigger">
                    <ActionButton title="Создать команду" show={true} action={callbacks.createCommand} requiresLoading={false}/>
                </div>
                <div className="business-rewarder__result">
                    <TextInput title="Вывод" placeholder="Здесь будет вывод" maxLength={1024} defaultValue={currentCommand}/>
                    <ActionButton title={copied ? "Скопировано": "Скопировать"} show={true} action={callbacks.copy} requiresLoading={false}/>
                </div>
            </ContentTitle>
        </div>
    );
};

export default React.memo(BusinessRewarder);