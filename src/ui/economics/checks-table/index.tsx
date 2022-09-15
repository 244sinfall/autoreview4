import React, {useEffect, useState} from 'react';
import {
    Check,
    CheckResponse,
    CheckTableSearchParams, defaultCheck,
    defaultCheckTableSearchParams,
    getChecks, getCheckStatusName, getCheckStatusValue
} from "../../../model/checks";
import ContentTitle from "../../../components/static/content-title";
import LoadingSpinner from "../../../components/static/loading-spinner";
import Table from "../../../components/dynamic/table";
import './styles.css'
import TextInput from "../../../components/dynamic/text-input";
import ActionButton from "../../../components/static/action-button";
import RadioButtonGroup from "../../../components/dynamic/radio-button-group";
import Pagination from "../../../components/dynamic/pagination";
import {useAuth} from "../../../model/auth/firebase/auth";


const ExecuteHelper = (props: {check: Check, closeHandler: () => void}) => {
    const rejectCommand = `.check reject ${props.check.Id}`
    const openCommand = `.check open ${props.check.Id}`
    const closeCommand = `.check close ${props.check.Id}`
    return (
        <div className="check-executor">
            <ContentTitle title={"Макросы для чека"}>
                {props.check.Status === "Отказан" && <p>Этот чек отказан. Его невозможно изменить. Игроку необходимо отправить новый чек.</p>}
                {props.check.Status === "Закрыт" && <TextInput title={"Переоткрыть чек"} placeholder={""} defaultValue={openCommand} maxLength={128}/>}
                {props.check.Status === "Ожидает" &&
                  <div className="executor-fields">
                    <TextInput title={"Закрыть чек"} placeholder={""} defaultValue={closeCommand} maxLength={128}/>
                    <TextInput title={"Отказать чек"} placeholder={""} defaultValue={rejectCommand} maxLength={128}/>
                  </div>
                }
                <ActionButton title={"Закрыть"} show={true} action={props.closeHandler} requiresLoading={false}/>
            </ContentTitle>
        </div>
    )
}

const ChecksTable = () => {
    const [checks, setChecks] = useState<CheckResponse>({checks: [], count: 0, filteredCount: 0, updatedAt: new Date()})
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [params, setParams] = useState<CheckTableSearchParams>(defaultCheckTableSearchParams)
    const [selectedCheck, setSelectedCheck] = useState<Check | null>(null)
    const [errMsg, setErrMsg] = useState("")
    const {currentUser} = useAuth()
    useEffect(() => {
        setIsLoading(true)
        getChecks(params).then((c) => {
            setChecks(c)
            setIsLoading(false)
            setErrMsg("")
        }).catch((e) => {
            if("error" in e) {
                if(e.error.includes("unavailable")) return setErrMsg("Сервис недоступен (вероятно, кэш обновляется)")
                setErrMsg(e.message ?? "Что-то пошло не так...")
            }
        })
    },[params])
    const triggerCacheUpdate = async () => {
        if(currentUser === null || !currentUser?.canAccess(1)) throw new Error("Недостаточно прав")
        try {
            const c = await getChecks({...params, force: true});
            setChecks(c);
        } catch(e: any) {
            if("error" in e) {
                if(e.error.includes("5 min")) return setErrMsg("Обновлять кэш можно не чаще, чем раз в 5 минут")
                if(e.error.includes("unavailable")) return setErrMsg("Сервис недоступен (вероятно, кэш обновляется)")
                setErrMsg(e.message ?? "")
            }
        }
    }
    const elementsPerPageHandler = (value: string) => {
        setParams({...params, limit: Number(value), skip: 0})
        setPage(1)
    }
    let timeout: NodeJS.Timeout
    const searchHandler = (fieldName: string, fieldValue: string) => {
        if(timeout) clearTimeout(timeout)
        timeout = setTimeout(() => {
            setParams({...params, search: fieldValue, skip: 0})
            setPage(1)
        }, 1000)
    }
    const showOnlyHandler = (value: string) => {
        setParams({...params, status: getCheckStatusValue(value), skip: 0})
        setPage(1)
    }
    const pageChangeHandler = (newPage: number) => {
        setParams({...params, skip: (newPage-1) * params.limit})
        setPage(newPage)
    }
    const handleTableClick = (check: any[]) => {
        if(currentUser?.canAccess(1)) {
            const newCheck = defaultCheck
            newCheck.Id = check[0]
            newCheck.Date = check[1]
            newCheck.Owner = check[2]
            newCheck.Type = check[3]
            newCheck.Money = check[4]
            newCheck.Name = check[5]
            newCheck.Description = check[6]
            newCheck.Body = check[7]
            newCheck.Status = check[8]
            newCheck.Gm = check[9]
            setSelectedCheck(newCheck)
        }
    }
    const quitSelectedCheck = () => {
        setSelectedCheck(null)
    }
    const cacheUpdateToolTip =
        'Обновление кэша подразумевает скачивание всех чеков с сайта Darkmoon.<br/>' +
        'Сервер проводит эту операцию каждые 30 минут. Обновление может занять<br/>' +
        'несколько минут (обычно, хватает 1-2 минут). Сервис будет недоступен<br/>' +
        'во время обновления. Запрашивать обновление можно не чаще раза в 5 минут<br/>' +
        'Обновлять кэш вручную могут только пользователи с группой доступа "ГМ"'
    return (
        <div className="checks-table">
            <ContentTitle title={"Экономические чеки"}>
                <div className="checks-table-controls">
                    <div className="checks-table-controls table-settings">
                        <div className="specifiers">
                            <RadioButtonGroup title={""} options={["Все", "Ожидает", "Закрыт", "Отказан"]} groupName={"showOnly"} handler={showOnlyHandler} defaultValue={getCheckStatusName(params.status)}/>
                            <TextInput title="" placeholder={"Поиск"} maxLength={128} handler={searchHandler}/>
                        </div>
                        <RadioButtonGroup title={"Показывать"} options={["20","50","100"]} groupName={"elementsPerPage"} handler={elementsPerPageHandler} defaultValue={String(params.limit)}/>
                        <p style={{color: "red"}}>{errMsg}</p>
                    </div>
                    <div className="checks-table-controls checks-info">
                        <p>Данные актуальны на: {checks.updatedAt.toLocaleString("ru")}</p>
                        <p>Чеков в БД: {checks.count}. Чеков с учетом фильтра: {checks.filteredCount}</p>
                        <ActionButton title={"Обновить кэш"} show={currentUser ? currentUser.canAccess(1) : false} action={triggerCacheUpdate} requiresLoading={true} tooltip={cacheUpdateToolTip}/>
                    </div>
                </div>
                {selectedCheck && <ExecuteHelper check={selectedCheck} closeHandler={quitSelectedCheck}/>}
                <LoadingSpinner spin={isLoading}>
                    <Table columns={["ID","Дата и время", "Владелец", "Тип", "Деньги", "Название","Описание","Вложения","Статус","ГМ"]} content={checks?.checks ?? []} handleClick={handleTableClick}/>
                    <Pagination itemsAmount={checks.filteredCount} itemsPerPage={params.limit} currentPage={page} clickHandler={pageChangeHandler}/>
                </LoadingSpinner>
            </ContentTitle>

        </div>
    );
};

export default ChecksTable;