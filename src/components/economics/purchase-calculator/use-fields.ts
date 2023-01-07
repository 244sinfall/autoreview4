import {useCallback, useEffect, useState} from "react";
import {PurchaseArguments} from "../../../model/economics/economic-upgrade-calculator/types";

export const useFields = <T extends PurchaseArguments>(defaults: T, onUpdate: (newT: T) => void) => {
    const [values, setValues] = useState<T>(defaults)
    const updateValues = useCallback((name: keyof T, val: number) => {
        setValues(prev => {
            const newState = {...prev, [name]: val}
            onUpdate(newState)
            return newState
        })
    }, [onUpdate])
    useEffect(() => {
        setValues(defaults)
    }, [defaults])
    return { values, updateValues }
}