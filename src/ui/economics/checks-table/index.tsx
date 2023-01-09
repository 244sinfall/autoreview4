import React, {useCallback, useEffect, useRef, useState} from 'react';
import {PERMISSION} from "../../../model/user";
import CheckRow from "../../../components/economics/checktable/table/row";
import {Check} from "../../../model/economics/checks/check";
import {CheckResponse, CheckTableParams, CheckTableParamsCompanion} from "../../../model/economics/checks/types";
import {CheckProvider} from "../../../model/economics/checks/provider";
import CheckTableWrapper from "../../../components/economics/checktable";
import {useAppSelector} from "../../../services/services/store";
import useServices from "../../../services/use-services";
import {NotAuthorizedException} from "../../../model/exceptions";

const ChecksTable = () => {
    const state = useAppSelector((state) => ({
        user: state.user.user
    }))
    const services = useServices();
    const provider = useRef(new CheckProvider());
    const searchDebounce = useRef<NodeJS.Timeout | null>(null)
    const [apiResponse, setApiResponse] = useState<CheckResponse & {checks: Check[]} | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [params, setParams] = useState<CheckTableParams>(CheckTableParamsCompanion.default())
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
            if(state.user.permission < PERMISSION.GM) throw new Error("Недостаточно прав")
            try {
                const token = await services.get("FirebaseUser").getToken()
                await updateChecks(token)
            } catch (e: unknown) {
                if(e instanceof NotAuthorizedException) {
                    setErrMsg("Вы не авторизованы!")
                }
            }
        }, [services, state.user.permission, updateChecks]),
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
                if(state.user.permission >= PERMISSION.Arbiter) {
                    setSelectedCheck(check)
                }
            }} />
        }, [state.user])
    }

    return (
        <CheckTableWrapper renderCheck={callbacks.renderCheck}
                           onForce={callbacks.onForce}
                           isLoading={isLoading}
                           isUserAbleToForce={state.user.permission >= PERMISSION.GM}
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