import React, {useCallback, useEffect, useMemo, useState} from 'react';
import ContentTitle from "../../components/static/content-title";
import Table from "../../components/dynamic/table";
import './styles.css'
import ActionButton from "../../components/static/action-button";
import {useAuth} from "../../model/auth/use-auth";
import LoadingSpinner from "../../components/static/loading-spinner";
import {Permission} from "../../model/auth/user";
import {
    ClaimedItem,
    ClaimedItemAddHandler,
    ClaimedItemEditHandler,
    ClaimedItemEditorChangeable,
    ClaimedItemRequests,
    ClaimedItemsTablesImpl,
    ClaimedItemsTablesOrder,
    getClaimedItemQuality,
} from "../../model/claimed-items";
import ClaimedItemCategory from "./item-category";
import ClaimedItemEditor from "./item-editor";
import ClaimedItemAdder from "./item-adder";
import AuthorizedUser from "../../model/auth/user/authorized-user";
import ItemRow from "./item-row";

const ClaimedItemsPage = () => {
    const [claimedItems, setClaimedItems] = useState<ClaimedItemsTablesImpl>()
    const [isCreatingItem, setIsCreatingItem] = useState<string | null>(null)
    const [selectedItem, setSelectedItem] = useState<ClaimedItem | null>(null)
    const [requireUpdate, setRequireUpdate] = useState(true)
    const [errMsg, setErrMsg] = useState("")
    const {currentUser} = useAuth()
    const handleClick = useCallback((item: ClaimedItem) => {
        if(currentUser.canAccess(Permission.reviewer)) {
            setSelectedItem(item)
            setIsCreatingItem(null)
        }
    }, [currentUser])
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
            if(!(currentUser instanceof AuthorizedUser)) throw new Error("Пользователь не авторизован")
            const res = await ClaimedItemRequests.add(i, currentUser)
            if(res) return analyzeResponse(res)
        }
    }
    useEffect(() => {
        if(requireUpdate) {
            ClaimedItemRequests.get().then(i => {
                setClaimedItems(i)
                setRequireUpdate(false)
            })
        }
    },[requireUpdate])
    const renderFunction = useCallback((item: ClaimedItem) => {
        return <ItemRow key={item.id} item={item} onClick={() => handleClick(item)}/>
    }, [handleClick])
    const tables = useMemo(() => {
        if(claimedItems) {
            return Object.entries(claimedItems).map((k: [string, ClaimedItem[]]) => {
                return <Table<ClaimedItem> key={k[0]} columns={["Название", "Владелец", "Доказательство владения", "Согласовавший",
                    "Дата добавления", "Утвердивший", "Дата утверждения", "Доп. инфо"]}
                              content={k[1]} renderFunction={renderFunction}/>
            }).sort((a, b) => {
                const numA = ClaimedItemsTablesOrder[(a.key as string) as keyof typeof ClaimedItemsTablesOrder]
                const numB = ClaimedItemsTablesOrder[(b.key as string) as keyof typeof ClaimedItemsTablesOrder]
                return numA < numB ? -1 : 1
            })
        }
    }, [claimedItems, renderFunction])
    const tablesWithControls = useMemo(() => {
        if(tables) {
            return tables.map((t) => {
                return <ClaimedItemCategory key={t.key} t={t} addButtonHandler={addItemButtonHandler} user={currentUser}/>
            })
        }
    }, [currentUser, tables])
    return (
        <div className="claimed-items">
        <ContentTitle title="Таблица именных предметов" controllable={false}>
            {selectedItem && !isCreatingItem && <ClaimedItemEditor
              item={selectedItem} user={currentUser} callbacks={editHandlers}/>}
            {!selectedItem && isCreatingItem && <ClaimedItemAdder
              quality={getClaimedItemQuality(isCreatingItem)} reviewerName={currentUser.name}
              callbacks={addHandlers}/>}
            <LoadingSpinner spin={requireUpdate}>
                <p style={{color: "red", textAlign: "center"}}>{errMsg && errMsg}</p>
                <div className="claimed-items__tables">
                    {tablesWithControls}
                </div>
            </LoadingSpinner>
            <ActionButton title="Сгенерировать HTML"
                          action={() => claimedItems && navigator.clipboard.writeText(claimedItems.generateTableHTML())}
                          show={currentUser ? currentUser.canAccess(Permission.admin) : false} requiresLoading={true}/>
        </ContentTitle>
        </div>
    );
};

export default ClaimedItemsPage;