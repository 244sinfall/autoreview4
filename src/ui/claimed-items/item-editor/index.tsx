import {ClaimedItem, ClaimedItemEditHandler, ClaimedItemInterface} from "../../../model/claimed-items";
import Visitor, {Permission} from "../../../model/auth/user";
import React, {useState} from "react";
import TextInput from "../../../components/dynamic/text-input";
import ActionButton from "../../../components/static/action-button";
import ModalTitle from "../../../components/static/modal-title";

const ClaimedItemEditor = (props:{item: ClaimedItem, user: Visitor, callbacks: ClaimedItemEditHandler}) => {
    const [changeable, setChangeable] = useState<ClaimedItemInterface>({...props.item})
    const handleChange = (fieldName: string, newValue: string) => {
        switch (fieldName) {
            case "Владелец": setChangeable({...changeable, owner: newValue}); break;
            case "Профиль владельца": setChangeable({...changeable, ownerProfile: newValue}); break;
            case "Доказательство отыгрыша": setChangeable({...changeable, ownerProofLink: newValue}); break;
            case "Название": setChangeable({...changeable, name: newValue}); break;
            case "Ссылка на предмет": setChangeable({...changeable, link: newValue}); break;
            case "Согласовавший рецензент": setChangeable({...changeable, reviewer: newValue}); break;
            case "Доп. инфо": setChangeable({...changeable, additionalInfo: newValue}); break;
        }
    }
    return (

        <ModalTitle title="Редактировать предмет">
            <div className="ItemModal-content">
                <div className="ItemModal-fields">
                    <TextInput title="Качество" placeholder={""} maxLength={128} disabled={true} defaultValue={props.item.quality}/>
                    <TextInput title="Название" placeholder={""} maxLength={256} disabled={!props.user.canAccess(Permission.admin)} handler={handleChange} defaultValue={changeable.name}/>
                    <TextInput title="Ссылка на предмет" placeholder={""} maxLength={256} disabled={!props.user.canAccess(Permission.admin)} handler={handleChange} defaultValue={changeable.link}/>
                    <TextInput title="Владелец" placeholder={""} maxLength={256} disabled={false} defaultValue={changeable.owner} handler={handleChange}/>
                    <TextInput title="Профиль владельца" placeholder={""} maxLength={256} disabled={false} defaultValue={changeable.ownerProfile} handler={handleChange}/>
                    <TextInput title="Доказательство отыгрыша" placeholder={""} maxLength={256} disabled={false} defaultValue={changeable.ownerProofLink} handler={handleChange}/>
                    <TextInput title="Согласовавший рецензент" placeholder={""} maxLength={256} disabled={!props.user.canAccess(Permission.admin)} handler={handleChange} defaultValue={changeable.reviewer}/>
                    <TextInput title="Утвержден" placeholder={""} maxLength={256} disabled={true} defaultValue={props.item.accepted ? props.item.acceptor : "Не утвержден"}/>
                    <TextInput title="Дата добавления" placeholder={""} maxLength={256} disabled={true} defaultValue={props.item.addedAt?.toLocaleString() ?? "Неизвестно"}/>
                    {props.item.accepted && <TextInput title="Дата утверждения" placeholder={""} maxLength={256} disabled={true} defaultValue={props.item.acceptedAt.toLocaleString()}/>}
                    <TextInput title="Доп. инфо" placeholder={""} maxLength={256} disabled={false} handler={handleChange} defaultValue={changeable.additionalInfo}/>
                </div>
                <div className="ItemModal-controls">
                    <ActionButton title="Закрыть" show={true} action={props.callbacks.close} requiresLoading={false}/>
                    <ActionButton title="Изменить" show={props.user ? props.user.canAccess(Permission.reviewer) : false} action={() => props.callbacks.update(props.item.id, changeable)} requiresLoading={true}/>
                    <ActionButton title="Утвердить" show={props.user ? props.user.canAccess(Permission.admin) : false} action={() => props.callbacks.accept(props.item.id)} requiresLoading={true}/>
                    <ActionButton title="Удалить" show={props.user ? props.user.canAccess(Permission.admin) : false} action={() => props.callbacks.del(props.item.id)} requiresLoading={true}/>
                </div>
            </div>
        </ModalTitle>
    )
}

export default React.memo(ClaimedItemEditor)