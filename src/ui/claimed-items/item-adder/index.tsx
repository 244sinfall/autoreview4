import {ClaimedItem, ClaimedItemAddHandler} from "../../../model/claimed-items";
import TextInput from "../../../components/common/dynamic/text-input";
import ActionButton from "../../../components/common/static/action-button";
import React from "react";
import '../item-modal-css/style.css'
import ModalTitle from "../../../components/common/static/modal-title";

const ClaimedItemAdder = (props: {quality: string, reviewerName: string, callbacks: ClaimedItemAddHandler}) => {
    const item = new ClaimedItem(undefined,props.quality, props.reviewerName)
    const handleChange = (fieldName: string, newValue: string) => {
        switch (fieldName) {
            case "Название": item.name = newValue; break;
            case "Ссылка на предмет": item.link = newValue; break;
            case "Владелец": item.owner = newValue; break;
            case "Профиль владельца": item.ownerProfile = newValue; break;
            case "Доп. инфо": item.additionalInfo = newValue; break;
        }
    }
    return (
        <ModalTitle title="Добавить предмет" closeCallback={props.callbacks.close}>
            <div className='ItemModal-content'>
                <div className="ItemModal-fields">
                    <TextInput title="Качество" placeholder={""} maxLength={128} disabled={true} defaultValue={props.quality}/>
                    <TextInput title="Название" placeholder={""} maxLength={256} disabled={false} defaultValue={item.name} handler={handleChange}/>
                    <TextInput title="Ссылка на предмет" placeholder={""} maxLength={256} disabled={false} defaultValue={item.link} handler={handleChange}/>
                    <TextInput title="Владелец" placeholder={""} maxLength={256} disabled={false} defaultValue={item.owner} handler={handleChange}/>
                    <TextInput title="Профиль владельца" placeholder={""} maxLength={256} disabled={false} defaultValue={item.ownerProfile} handler={handleChange}/>
                    <TextInput title="Согласовавший рецензент" placeholder={""} maxLength={256} disabled={true} defaultValue={props.reviewerName}/>
                    <TextInput title="Доп. инфо" placeholder={""} maxLength={256} disabled={false} handler={handleChange}/>
                </div>
                <div className="ItemModal-controls">
                    <ActionButton title="Добавить" show={true} action={() => props.callbacks.add(item)} requiresLoading={true}/>
                </div>
            </div>
        </ModalTitle>

    )
}

export default React.memo(ClaimedItemAdder)