import React, {useCallback, useEffect, useRef, useState} from 'react';
import {PERMISSION} from "../../../model/auth/user";
import CheckRow from "../../../components/economics/checktable/table/row";
import {Check} from "../../../model/economics/checks/check";
import {CheckResponse, CheckTableParams} from "../../../model/economics/checks/types";
import {CheckProvider} from "../../../model/economics/checks/provider";
import CheckTableWrapper from "../../../components/economics/checktable";
import {useAuth} from "../../../model/auth/use-auth";

const ChecksTable = () => {
    const {currentUser} = useAuth()
    const provider = useRef(new CheckProvider());
    const searchDebounce = useRef<NodeJS.Timeout | null>(null)
    const [apiResponse, setApiResponse] = useState<CheckResponse & {checks: Check[]} | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [params, setParams] = useState<CheckTableParams>(CheckTableParams.default())
    const [selectedCheck, setSelectedCheck] = useState<Check | null>(null)
    const [errMsg, setErrMsg] = useState("")

    const updateChecks = useCallback(async(token: string | undefined) => {
        setIsLoading(true)
        try {
            const checks = await provider.current.get(token)
            setErrMsg("")
            return checks
        } catch (e: unknown) {
            if(e instanceof Error) {
                if (e.message.includes("unavailable")) setErrMsg("Сервис недоступен (вероятно, кэш обновляется)")
                else if (e.message.includes("5 minutes")) setErrMsg("Обновлять кэш можно не чаще раза в 5 минут")
                else setErrMsg(e.message || "Что-то пошло не так...")
            }
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        provider.current.setParams(params)
        updateChecks(undefined).then((response) => response && setApiResponse(response))
    },[params, updateChecks])
    
    const callbacks = {
        onForce: useCallback(async() => {
            if(!currentUser.canAccess(PERMISSION.GM)) throw new Error("Недостаточно прав")
            const token = await currentUser.getToken()
            await updateChecks(token)
        }, [currentUser, updateChecks]),
        onParamsChange: useCallback(<K extends keyof CheckTableParams,V extends CheckTableParams[K]>(key: K, value: V) => {
            if(key === "search") {
                if(searchDebounce.current) clearTimeout(searchDebounce.current)
                searchDebounce.current = setTimeout(() => {
                    setParams(prev => ({...prev, [key]: value, skip: 0}))
                }, 1000)
                return
            }
            if(key !== "skip") {
                return setParams(prev => ({...prev, [key]: value, skip: 0}))
            }
            return setParams(prev => ({...prev, [key]: value}))

        }, []),
        renderCheck: useCallback((check: Check) => {
            return <CheckRow key={check.check.id} check={check} onClick={() => {
                if(currentUser.canAccess(PERMISSION.Arbiter)) {
                    setSelectedCheck(check)
                }
            }} />
        }, [currentUser])
    }

    return (
        <CheckTableWrapper renderCheck={callbacks.renderCheck}
                           onForce={callbacks.onForce}
                           isLoading={isLoading}
                           isUserAbleToForce={currentUser.canAccess(PERMISSION.GM)}
                           onParamsChange={callbacks.onParamsChange}
                           params={params}
                           error={errMsg}
                           response={apiResponse}
                           modal={selectedCheck ? {
                               check: selectedCheck,
                               onClose: () => setSelectedCheck(null)
                           }: undefined}/>
    );
};

export default ChecksTable;