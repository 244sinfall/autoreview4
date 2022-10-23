import React, {useCallback, useState} from 'react';
import ContentTitle from "../../../components/static/content-title";
import TextInput from "../../../components/dynamic/text-input";
import NumberInput from "../../../components/dynamic/number-input";
import ActionButton from "../../../components/static/action-button";
import Selector from "../../../components/dynamic/selector";
import {
    BusinessRewardInfo,
    defaultBusinessInfo, getCommand,
    getResourceId,
    resources
} from "../../../model/arbiters/business-rewarder";
import './style.css'

const BusinessRewarder = () => {
    const [businessInfo, setBusinessInfo] = useState<BusinessRewardInfo>(defaultBusinessInfo)
    const [currentCommand ,setCurrentCommand] = useState("")
    const [copied, setCopied] = useState(false)
    const callbacks = {
        isDoubleReward: useCallback((e: any) => setBusinessInfo({...businessInfo, double: e.target.checked}), [businessInfo]),
        textFieldChange: useCallback((fieldName: string, fieldValue: string) => {
            switch (fieldName) {
                case "Владелец": return setBusinessInfo({...businessInfo, owner: fieldValue})
                case "Номер POI": return setBusinessInfo({...businessInfo, poi: fieldValue})
            }
        }, [businessInfo]),
        selectorValueChange: useCallback((newValue: string) => setBusinessInfo({...businessInfo, 
            resource: getResourceId(newValue)}), [businessInfo]),
        numericFieldChange: useCallback((fieldName: string, fieldValue: number) => {
            switch (fieldName) {
                case "Уровень POI": return setBusinessInfo({...businessInfo, poiLevel: fieldValue})
                case "Количество рабочих": return setBusinessInfo({...businessInfo, labors: fieldValue})
            }
        }, [businessInfo]),
        createCommand: useCallback(() => setCurrentCommand(getCommand(businessInfo)), [businessInfo]),
        copy: useCallback(() => {
            setCopied(true)
            navigator.clipboard.writeText(currentCommand)
                .then(() => {
                    setTimeout(() => setCopied(false), 500)
                })
        }, [currentCommand])
    }
    return (
        <div className="business-rewarder">
            <ContentTitle title="Активность предприятий">
                <div className="business-rewarder__selectors">
                    <TextInput title="Владелец" placeholder="Васян" maxLength={64} handler={callbacks.textFieldChange}/>
                    <TextInput title="Номер POI" placeholder="8715" maxLength={8} handler={callbacks.textFieldChange}/>
                    <span className="business-rewarder__checkbox-selector">
                        <>
                            <input id="double" type={"checkbox"} onChange={callbacks.isDoubleReward} checked={businessInfo.double}/>
                            <label htmlFor="double">Удвоить награду?</label>
                        </>
                        <Selector options={resources} changeHandler={callbacks.selectorValueChange} selected={"Выберите тип ресурса"}/>
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