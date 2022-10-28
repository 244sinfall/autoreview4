import {ClaimedItem, ClaimedItemAddHandler} from "../../../model/claimed-items";
import ContentTitle from "../../../components/static/content-title";
import TextInput from "../../../components/dynamic/text-input";
import ActionButton from "../../../components/static/action-button";
import React from "react";

const ClaimedItemAdder = (props: {quality: string, reviewerName: string, callbacks: ClaimedItemAddHandler}) => {
    const item = new ClaimedItem(undefined,props.quality, props.reviewerName)
    const handleChange = (fieldName: string, newValue: string) => {
        switch (fieldName) {
            case "Название": item.name = newValue; break;
            case "Ссылка на предмет": item.link = newValue; break;
            case "Владелец": item.owner = newValue; break;
            case "Профиль владельца": item.ownerProfile = newValue; break;
        }
    }
    return (
        <div className="claimed-items-modal-wrapper">
            <div className="claimed-items-modal">
                <ContentTitle title="Добавить предмет" controllable={false}>
                    <TextInput title="Качество" placeholder={""} maxLength={128} disabled={true} defaultValue={props.quality}/>
                    <TextInput title="Название" placeholder={""} maxLength={256} disabled={false} defaultValue={item.name} handler={handleChange}/>
                    <TextInput title="Ссылка на предмет" placeholder={""} maxLength={256} disabled={false} defaultValue={item.link} handler={handleChange}/>
                    <TextInput title="Владелец" placeholder={""} maxLength={256} disabled={false} defaultValue={item.owner} handler={handleChange}/>
                    <TextInput title="Профиль владельца" placeholder={""} maxLength={256} disabled={false} defaultValue={item.ownerProfile} handler={handleChange}/>
                    <TextInput title="Согласовавший рецензент" placeholder={""} maxLength={256} disabled={true} defaultValue={props.reviewerName}/>
                    <div className="claimed-item-editor-controls">
                        <ActionButton title="Закрыть" show={true} action={props.callbacks.close} requiresLoading={false}/>
                        <ActionButton title="Добавить" show={true} action={() => props.callbacks.add(item)} requiresLoading={true}/>
                    </div>
                </ContentTitle>
            </div>
        </div>
    )
}

export default React.memo(ClaimedItemAdder)