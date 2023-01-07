import React, {useCallback, useMemo, useState} from 'react';
import {ClaimedItemInterface} from "../../../model/claimed-items/types";
import ModalTitle from "../../common/modal-title";
import TextInput from "../../common/text-input";
import Visitor, {PERMISSION} from "../../../model/auth/user";
import ActionButton from "../../common/action-button";
import Field from "../../common/field";
import './styles.css'

export type ClaimedItemEditorProps = {
    onEdit: (editedItem: ClaimedItemInterface) => Promise<void>,
    onApprove: (id: string) => Promise<void>,
    onDelete: (id: string) => Promise<void>,
    onClose: () => void
    item: ClaimedItemInterface
    user: Visitor
}
const ClaimedItemEditor = (props: ClaimedItemEditorProps) => {
    const [changeable, setChangeable] = useState<ClaimedItemInterface>(props.item)
    const handleChange = useCallback(<K extends keyof ClaimedItemInterface, V extends ClaimedItemInterface[K]>(key: K, value: V) => {
        setChangeable(prev => ({...prev, [key]: value}))
    }, [])
    const containerOptions = useMemo(() => ({collapsedOptions: {widthToCollapse: 480}}), [])
    return (
        <ModalTitle className="claimed-items-table-edit" title="Редактировать предмет" closeCallback={props.onClose}>

            <Field title="Качество" containerOptions={containerOptions}>
                <TextInput disabled={true} value={props.item.quality} />
            </Field>
            <Field title="Название" containerOptions={containerOptions}>
                <TextInput maxLength={256}
                           disabled={!props.user.canAccess(PERMISSION.Admin)}
                           onChange={newName => handleChange("name", newName)}
                           value={changeable.name}/>
            </Field>
            <Field title="Ссылка на предмет" containerOptions={containerOptions}>
                <TextInput maxLength={256}
                           disabled={!props.user.canAccess(PERMISSION.Admin)}
                           onChange={newLink => handleChange("link", newLink)}
                           value={changeable.link}/>
            </Field>
            <Field title="Владелец" containerOptions={containerOptions}>
                <TextInput maxLength={256}
                           value={changeable.owner}
                           onChange={newOwner => handleChange("owner", newOwner)}/>
            </Field>
            <Field title="Профиль владельца" containerOptions={containerOptions}>
                <TextInput maxLength={256}
                           value={changeable.ownerProfile}
                           onChange={newOwnerProfile => handleChange("ownerProfile", newOwnerProfile)}/>
            </Field>
            <Field title="Доказательство отыгрыша" containerOptions={containerOptions}>
                <TextInput maxLength={256}
                           value={changeable.ownerProofLink}
                           onChange={newProofLink => handleChange("ownerProofLink", newProofLink)}/>
            </Field>
            <Field title="Согласовавший рецензент" containerOptions={containerOptions}>
                <TextInput maxLength={256}
                           disabled={!props.user.canAccess(PERMISSION.Admin)}
                           onChange={newReviewer => handleChange("reviewer", newReviewer)}
                           value={changeable.reviewer}/>
            </Field>
            {props.item.accepted && <>
              <Field title="Утвержден" containerOptions={containerOptions}>
                <TextInput maxLength={256}
                           disabled={true}
                           value={props.item.acceptor}/>
              </Field>
              <Field title="Дата утверждения" containerOptions={containerOptions}>
                <TextInput maxLength={256}
                           disabled={true}
                           value={props.item.acceptedAt.toLocaleString() ?? "Неизвестно"}/>
              </Field>
            </>}
            <Field title="Дата добавления" containerOptions={containerOptions}>
                <TextInput maxLength={256}
                           disabled={true}
                           value={props.item.addedAt?.toLocaleString() ?? "Неизвестно"}/>
            </Field>
            <Field title="Доп. инфо" containerOptions={containerOptions}>
                <TextInput maxLength={256}
                           onChange={newInfo => handleChange("additionalInfo", newInfo)}
                           value={changeable.additionalInfo}/>
            </Field>
            <div className="claimed-item-editor-controls">
                {props.user.canAccess(PERMISSION.Reviewer) &&
                  <ActionButton title="Изменить"
                                onClick={() => props.onEdit(changeable)}/>}
                {props.user.canAccess(PERMISSION.Admin) &&
                  <ActionButton title="Утвердить"
                                onClick={() => props.onApprove(props.item.id)}/>}
                {props.user.canAccess(PERMISSION.Admin) &&
                  <ActionButton title="Удалить"
                                onClick={() => props.onDelete(props.item.id)} />}
            </div>
        </ModalTitle>
    )
};

export default ClaimedItemEditor;