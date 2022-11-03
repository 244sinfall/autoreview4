import React, {useCallback, useEffect, useState} from 'react';
import {
    Check,
    CheckResponse,
    CheckTableSearchParams,
    defaultCheckTableSearchParams,
    getChecks,
    getCheckStatusName,
    getCheckStatusValue,
    ICheck
} from "../../../model/checks";
import ContentTitle from "../../../components/static/content-title";
import LoadingSpinner from "../../../components/static/loading-spinner";
import Table from "../../../components/dynamic/table";
import './styles.css'
import TextInput from "../../../components/dynamic/text-input";
import ActionButton from "../../../components/static/action-button";
import RadioButtonGroup from "../../../components/dynamic/radio-button-group";
import Pagination from "../../../components/dynamic/pagination";
import {useAuth} from "../../../model/auth/use-auth";
import Selector from "../../../components/dynamic/selector";
import {Permission} from "../../../model/auth/user";
import ExecuteHelper from "./check-modal";
import CheckRow from "./check-row";

const ChecksTable = () => {
    const [checks, setChecks] = useState<CheckResponse>({checks: [], count: 0,
        filteredCount: 0, updatedAt: new Date(), types: []})
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [params, setParams] = useState<CheckTableSearchParams>(defaultCheckTableSearchParams)
    const [selectedCheck, setSelectedCheck] = useState<ICheck | null>(null)
    const [errMsg, setErrMsg] = useState("")
    const {currentUser} = useAuth()
    let searchDebounce: NodeJS.Timeout | null = null
    const receiveChecks = async(query?: CheckTableSearchParams, token?: string) => {
        try {
            const checks = await getChecks(query, token)
            setChecks(checks)
            setErrMsg("")
        } catch (e: any) {
            if ("error" in e) {
                if (e.error.includes("unavailable")) return setErrMsg("Сервис недоступен (вероятно, кэш обновляется)")
                if (e.error.includes("5 minutes")) return setErrMsg("Обновлять кэш можно не чаще раза в 5 минут")
                setErrMsg(e.message ?? "Что-то пошло не так...")
            }
        }
    }
    // Обновленеи чеков
    useEffect(() => {
        setIsLoading(true)
        receiveChecks(params).finally(() => setIsLoading(false))
    },[params])
    
    const callbacks = {
        onCacheUpdate: useCallback(async() => {
            setIsLoading(true)
            if(!currentUser.canAccess(Permission.gm)) throw new Error("Недостаточно прав")
            const token = await currentUser.getToken()
            await receiveChecks({...params, force: true}, token)
            await setIsLoading(false)
        }, [currentUser, params]),
        onElementPerPageChange: useCallback((value: string) => {
            setParams({...params, limit: Number(value), skip: 0})
            setPage(1)
        }, [params]),
        onShowOnlyFilter: useCallback((value: string) => {
            setParams({...params, status: getCheckStatusValue(value), skip: 0})
            setPage(1)
        }, [params]),
        onPaginate: useCallback((newPage: number) => {
            setParams({...params, skip: (newPage-1) * params.limit})
            setPage(newPage)
        }, [params]),
        onTableItemClick: useCallback((check: ICheck) => {
            if(currentUser.canAccess(Permission.arbiter) || selectedCheck === null) {
                setSelectedCheck(check)
            }
        }, [currentUser, selectedCheck]),
        onCheckModalClose: useCallback(() => setSelectedCheck(null), []),
        onSearch: (fieldName: string, fieldValue: string) => {
            if(searchDebounce) clearTimeout(searchDebounce)
            searchDebounce = setTimeout(() => {
                setParams({...params, search: fieldValue, skip: 0})
                setPage(1)
            }, 1000)
        },
        onCheckTypeChange: useCallback((newValue: string) => {
            setParams({...params, category: newValue === "Все получатели" ? "" : newValue, skip: 0})
            setPage(1)
        }, [params])
    }
    const renderFunction = (check: ICheck) => {
        if(check instanceof Check) return <CheckRow key={check.id} check={check} onClick={callbacks.onTableItemClick}></CheckRow>
        return <></>
    }
    const cacheUpdateToolTip =
        'Обновление кэша подразумевает скачивание всех чеков с сайта Darkmoon.<br/>' +
        'Сервер проводит эту операцию каждые 30 минут. Обновление может занять<br/>' +
        'несколько минут (обычно, хватает 1-2 минут). Сервис будет недоступен<br/>' +
        'во время обновления. Запрашивать обновление можно не чаще раза в 5 минут<br/>' +
        'Обновлять кэш вручную могут только пользователи с группой доступа "ГМ"'
    return (
        <div className="checks-table">
            <ContentTitle title={"Экономические чеки"} controllable={false}>
                <div className="checks-table-controls">
                    <div className="checks-table-controls table-settings">
                        <div className="specifiers">
                            <RadioButtonGroup title={""} options={["Все", "Ожидает", "Закрыт", "Отказан"]}
                                              groupName={"showOnly"} handler={callbacks.onShowOnlyFilter}
                                              defaultValue={getCheckStatusName(params.status)}/>
                            <TextInput title="" placeholder={"Поиск"} maxLength={128} handler={callbacks.onSearch}/>
                        </div>
                        <div className="specifiers">
                            <Selector options={checks.types}
                                      selected={params.category ? params.category : "Все получатели"}
                                      changeHandler={callbacks.onCheckTypeChange}/>
                            <RadioButtonGroup title={"Показывать"} options={["20","50","100"]}
                                              groupName={"elementsPerPage"} handler={callbacks.onElementPerPageChange}
                                              defaultValue={String(params.limit)}/>
                        </div>
                        <p style={{color: "red"}}>{errMsg}</p>
                    </div>
                    <div className="checks-table-controls checks-info">
                        <p>Данные актуальны на: {checks.updatedAt.toLocaleString("ru")}</p>
                        <p>Чеков в БД: {checks.count}. Чеков с учетом фильтра: {checks.filteredCount}</p>
                        <ActionButton title={"Обновить кэш"}
                                      show={currentUser.canAccess(Permission.gm)}
                                      action={callbacks.onCacheUpdate}
                                      requiresLoading={true} tooltip={cacheUpdateToolTip}/>
                    </div>
                </div>
                {selectedCheck && <ExecuteHelper check={selectedCheck} closeHandler={callbacks.onCheckModalClose}/>}
                <LoadingSpinner spin={isLoading}>
                    <Table<ICheck>
                        columns={["ID","Дата и время", "Владелец", "Тип", "Название",
                        "Описание","Деньги","ГМ","Статус","Вложения"]}
                           content={checks.checks}
                           renderFunction={renderFunction}/>
                    <Pagination itemsAmount={checks.filteredCount}
                                itemsPerPage={params.limit}
                                currentPage={page} clickHandler={callbacks.onPaginate}/>
                </LoadingSpinner>
            </ContentTitle>
        </div>
    );
};

export default ChecksTable;