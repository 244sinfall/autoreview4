import React, {useCallback, useEffect, useMemo, useState} from 'react';
import ContentTitle from "../../components/static/content-title";
import Table from "../../components/dynamic/table";
import './styles.css'
import ActionButton from "../../components/static/action-button";
import {useAuth} from "../../model/auth/firebase/auth";
import TextInput from "../../components/dynamic/text-input";
import {AuthorizedUser} from "../../model/auth/firebase/user";
import LoadingSpinner from "../../components/static/loading-spinner";
import {Permission} from "../../model/auth/firebase/user/model";
import {
    ClaimedItem, ClaimedItemEditorChangeable, ClaimedItemRequests,
    ClaimedItemsTablesClasses, generateTableHTML,
    getClaimedItemQuality,
    getClaimedItemsTitle, receiveItems
} from "../../model/claimed-items";



interface ClaimedItemEditHandler {
    close: () => void,
    update: (id: string, changes: any) => Promise<void>,
    accept: (id: string) => Promise<void>
    del: (id: string) => Promise<void>,
}
interface ClaimedItemAddHandler {
    close: () => void,
    add: (i: ClaimedItem) => Promise<void>
}




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
        <ContentTitle title="Добавить предмет">
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
            <ContentTitle title="Редактировать предмет">
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

const ClaimedItemCategory = (props:{t: JSX.Element, user: AuthorizedUser | null, addButtonHandler: (quality: string) => void}) => {
    const [isShowing, setIsShowing] = useState(true)
    return (
        <div key={props.t.key+"div"} className="claimed-items__category">
            <div className="claimed-items__header">
                <div className="claimed-items__info">
                    <p key={props.t.key+"p"}>{getClaimedItemsTitle(props.t.key as string)}</p>
                </div>
                <div className="claimed-items__controls">
                    <ActionButton title="Добавить" show={props.user ? props.user.canAccess(Permission.reviewer) : false} action={() => props.addButtonHandler(props.t.key as string)} requiresLoading={false}/>
                    <ActionButton title={isShowing ? "Скрыть" : "Показать"} show={true} action={() => setIsShowing(!isShowing)} requiresLoading={false}/>
                </div>
            </div>
            <div className="table-wrapper" style={{display: isShowing ? "block": "none"}}>
                {props.t}
            </div>
        </div>
    )
}

const ClaimedItemsPage = () => {
    const [claimedItems, setClaimedItems] = useState<ClaimedItemsTablesClasses>()
    const [isCreatingItem, setIsCreatingItem] = useState<string | null>(null)
    const [selectedItem, setSelectedItem] = useState<ClaimedItem | null>(null)
    const [requireUpdate, setRequireUpdate] = useState(true)
    const [errMsg, setErrMsg] = useState("")
    const {currentUser} = useAuth()
    const handleClick = useCallback((quality: string, v: any[], idx:number) => {
        const item = claimedItems && claimedItems[quality as keyof ClaimedItemsTablesClasses][idx]
        if(item) {
            setSelectedItem(item)
            setIsCreatingItem(null)
        }
    }, [claimedItems])
    const addItemButtonHandler = (quality: string) => {
        setIsCreatingItem(quality)
        setSelectedItem(null)
    }
    const editHandlers: ClaimedItemEditHandler = {
        close: () => setSelectedItem(null),
        accept: async(id: string) => {
            const res = await ClaimedItemRequests.accept(id, currentUser)
            if(res) return analyzeResponse(res)
        },
        update: async(id, changes: ClaimedItemEditorChangeable) => {
            const res = await ClaimedItemRequests.update(id, changes, currentUser)
            if(res) return analyzeResponse(res)
        },
        del: async(id: string) => {
            const res = await ClaimedItemRequests.del(id, currentUser)
            if(res) return analyzeResponse(res)
        }
    }
    const analyzeResponse = async(r: Response) => {
        if(r.status === 200) {
            selectedItem && setSelectedItem(null)
            isCreatingItem && setIsCreatingItem(null)
            return setRequireUpdate(true)
        }
        const json = await r.json()
        const err = 'error' in json ? json['error'] : "Неизвестная ошибка"
        selectedItem && setSelectedItem(null)
        isCreatingItem && setIsCreatingItem(null)
        return setErrMsg(err)
    }
    const addHandlers: ClaimedItemAddHandler = {
        close: () => setIsCreatingItem(null),
        add: async(i: ClaimedItem) => {
            const res = await ClaimedItemRequests.add(i, currentUser)
            if(res) return analyzeResponse(res)
        }
    }
    useEffect(() => {
        if(requireUpdate) {
            receiveItems().then(i => {
                setClaimedItems(i)
                setRequireUpdate(false)
            })
        }
    },[requireUpdate])
    const tables = useMemo(() => {
        if(claimedItems) {
            return Object.entries(claimedItems).map((k:[string, ClaimedItem[]]) => {
                return <Table key={k[0]} columns={["Название", "Владелец","Доказательство владения","Согласовавший",
                    "Дата добавления","Утвердивший","Дата утверждения"]}
                              content={k[1].map(i => i.toDisplay())}
                              handleClick={(v, idx) => {
                                  if(idx !== undefined) handleClick(k[0], v, idx)
                              }}/>
                })
        }
    }, [claimedItems, handleClick])
    const tablesWithControls = useMemo(() => {
        if(tables) {
            return tables.map((t) => {
                return <ClaimedItemCategory key={t.key} t={t} addButtonHandler={addItemButtonHandler} user={currentUser}/>
            })
        }
    }, [currentUser, tables])
    return (
        <div className="claimed-items-table">
        <ContentTitle title="Таблица именных предметов">
            {selectedItem && !isCreatingItem && <ClaimedItemEditor
              item={selectedItem} user={currentUser} callbacks={editHandlers}/>}
            {!selectedItem && isCreatingItem && <ClaimedItemAdder
              quality={getClaimedItemQuality(isCreatingItem)} reviewerName={currentUser?.displayName() ?? "Ошибка"}
              callbacks={addHandlers}/>}
            <LoadingSpinner spin={requireUpdate}>
                <p style={{color: "red"}}>{errMsg && errMsg}</p>
                {tablesWithControls}
            </LoadingSpinner>
            <ActionButton title="Сгенерировать HTML"
                          action={() => claimedItems && navigator.clipboard.writeText(generateTableHTML(claimedItems))}
                          show={currentUser ? currentUser.canAccess(Permission.admin) : false} requiresLoading={true}/>
        </ContentTitle>
        </div>
    );
};

export default ClaimedItemsPage;