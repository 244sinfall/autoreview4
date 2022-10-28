import {ClaimedItem, ClaimedItemEditHandler, ClaimedItemEditorChangeable} from "../../../model/claimed-items";
import {AuthorizedUser} from "../../../model/auth/firebase/user";
import React, {useState} from "react";
import ContentTitle from "../../../components/static/content-title";
import TextInput from "../../../components/dynamic/text-input";
import ActionButton from "../../../components/static/action-button";
import {Permission} from "../../../model/auth/firebase/user/model";

const ClaimedItemEditor = (props:{item: ClaimedItem, user: AuthorizedUser | null, callbacks: ClaimedItemEditHandler}) => {
    const [changeable, setChangeable] = useState<ClaimedItemEditorChangeable>({ owner: props.item.owner,
        ownerProfile: props.item.ownerProfile.trimStart(), ownerProofLink: props.item.ownerProofLink })
    const handleChange = (fieldName: string, newValue: string) => {
        switch (fieldName) {
            case "Владелец": setChangeable({...changeable, owner: newValue}); break;
            case "Профиль владельца": setChangeable({...changeable, ownerProfile: newValue}); break;
            case "Доказательство отыгрыша": setChangeable({...changeable, ownerProofLink: newValue}); break;
        }
    }
    return (
        <div className="claimed-items-modal-wrapper">
        <div className="claimed-items-modal">
        <ContentTitle title="Редактировать предмет" controllable={false}>
        <TextInput title="Качество" placeholder={""} maxLength={128} disabled={true} defaultValue={props.item.quality}/>
    <TextInput title="Название" placeholder={""} maxLength={256} disabled={true} defaultValue={props.item.name}/>
    <TextInput title="Ссылка на предмет" placeholder={""} maxLength={256} disabled={true} defaultValue={props.item.link}/>
    <TextInput title="Владелец" placeholder={""} maxLength={256} disabled={false} defaultValue={changeable.owner} handler={handleChange}/>
    <TextInput title="Профиль владельца" placeholder={""} maxLength={256} disabled={false} defaultValue={changeable.ownerProfile} handler={handleChange}/>
    <TextInput title="Доказательство отыгрыша" placeholder={""} maxLength={256} disabled={false} defaultValue={changeable.ownerProofLink} handler={handleChange}/>
    <TextInput title="Согласовавший рецензент" placeholder={""} maxLength={256} disabled={true} defaultValue={props.item.reviewer}/>
    <TextInput title="Утвержден" placeholder={""} maxLength={256} disabled={true} defaultValue={props.item.accepted ? props.item.acceptor : "Не утвержден"}/>
    <TextInput title="Дата добавления" placeholder={""} maxLength={256} disabled={true} defaultValue={props.item.addedAt?.toLocaleString() ?? "Неизвестно"}/>
    {props.item.accepted && <TextInput title="Дата утверждения" placeholder={""} maxLength={256} disabled={true} defaultValue={props.item.acceptedAt.toLocaleString()}/>}
    <div className="claimed-item-editor-controls">
    <ActionButton title="Закрыть" show={true} action={props.callbacks.close} requiresLoading={false}/>
    <ActionButton title="Изменить" show={props.user ? props.user.canAccess(Permission.reviewer) : false} action={() => props.callbacks.update(props.item.id, changeable)} requiresLoading={true}/>
    <ActionButton title="Утвердить" show={props.user ? props.user.canAccess(Permission.admin) : false} action={() => props.callbacks.accept(props.item.id)} requiresLoading={true}/>
    <ActionButton title="Удалить" show={props.user ? props.user.canAccess(Permission.admin) : false} action={() => props.callbacks.del(props.item.id)} requiresLoading={true}/>
    </div>
    </ContentTitle>
    </div>
    </div>
    )
}

export default React.memo(ClaimedItemEditor)