import React, {useCallback, useMemo, useState} from 'react';
import ModalTitle from "../../common/modal-title";
import TextInput from "../../common/text-input";
import ActionButton from "../../common/action-button";
import {
    ClaimedItemMinimal,
    ClaimedItemQualityTitles,
    ClaimedItemsTables
} from "../../../model/claimed-items/types";
import Field from "../../common/field";
import './styles.css'
export type ClaimedItemAdderProps = {
    quality: keyof ClaimedItemsTables
    reviewerName: string,
    onAdd: (item: Partial<ClaimedItemMinimal>) => Promise<void>
    onClose: () => void
}

const ClaimedItemAdder = (props: ClaimedItemAdderProps) => {
    const [item, setItem] = useState<Partial<ClaimedItemMinimal>>({
        quality: ClaimedItemQualityTitles[props.quality],
        reviewer: props.reviewerName,
    })
    const handleChange = useCallback(<K extends keyof ClaimedItemMinimal, V extends ClaimedItemMinimal[K]>(key: K, value: V) => {
        setItem(prev => ({...prev, [key]: value}))
    }, [])
    const containerOptions = useMemo(() => ({collapsedOptions: {widthToCollapse: 480}}), [])
    return (
        <ModalTitle className="claimed-items-table-add" title="Добавить предмет" closeCallback={props.onClose}>
            <Field title="Качество" containerOptions={containerOptions}>
                <TextInput disabled={true} value={item.quality} />
            </Field>
            <Field title="Название" containerOptions={containerOptions}>
                <TextInput maxLength={256}
                           onChange={newName => handleChange("name", newName)}
                           value={item.name}/>
            </Field>
            <Field title="Ссылка на предмет" containerOptions={containerOptions}>
                <TextInput maxLength={256}
                           onChange={newLink => handleChange("link", newLink)}
                           value={item.link}/>
            </Field>
            <Field title="Владелец" containerOptions={containerOptions}>
                <TextInput maxLength={256}
                           value={item.owner}
                           onChange={newOwner => handleChange("owner", newOwner)}/>
            </Field>
            <Field title="Профиль владельца" containerOptions={containerOptions}>
                <TextInput maxLength={256}
                           value={item.ownerProfile}
                           onChange={newOwnerProfile => handleChange("ownerProfile", newOwnerProfile)}/>
            </Field>
            <Field title="Согласовавший рецензент" containerOptions={containerOptions}>
                <TextInput maxLength={256}
                           disabled={true}
                           onChange={newReviewer => handleChange("reviewer", newReviewer)}
                           value={item.reviewer}/>
            </Field>
            <Field title="Доп. инфо" containerOptions={containerOptions}>
                <TextInput maxLength={256}
                           onChange={newInfo => handleChange("additionalInfo", newInfo)}
                           value={item.additionalInfo}/>
            </Field>
            <ActionButton title="Добавить" onClick={() => props.onAdd(item)}/>

        </ModalTitle>

    )
};

export default ClaimedItemAdder;