import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
    CalculationResult,
    EconomicalCalculator, PurchaseArguments,
    PurchaseMethod
} from "../../../model/economics/economic-upgrade-calculator/types";
import RadioButtonGroup from "../../common/radio-button-group";
import ActionButton from "../../common/action-button";
import Field from "../../common/field";

type PurchaseCalculatorTypes<T extends PurchaseArguments, U extends PurchaseMethod> = {
    executor: EconomicalCalculator<T, U>
    onCalculate: (title: string, result: CalculationResult) => void
}
const PurchaseCalculator = <T extends PurchaseArguments, U extends PurchaseMethod>(props: PurchaseCalculatorTypes<T, U>) => {
    const [payMethod, setPayMethod] = useState<U>(props.executor.getPayMethods()[0])
    const [errMsg, setErrMsg] = useState("")
    const [fieldsData, setFieldsData] = useState<T>(props.executor.defaults())
    const callbacks = {
        onFieldsUpdate: useCallback((data: T) => {
            setFieldsData(data)
        }, []),
        onSubmit: useCallback(() => {
            try {
                props.onCalculate(props.executor.getCalculationTitle(fieldsData),
                    props.executor.calculate(fieldsData, payMethod))
            } catch (e: unknown) {
                if(e instanceof Error) {
                    setErrMsg(e.message)
                    setTimeout(() => setErrMsg(""), 1500)
                }
            }


        }, [fieldsData, payMethod, props])
    }
    const FieldsComponent = useMemo(() => {
        return props.executor.getRelativeComponent();
    }, [props.executor])

    useEffect(() => {
        setFieldsData(props.executor.defaults())
        setPayMethod(props.executor.getPayMethods()[0])
    }, [props.executor])

    return (
        <div className="economical-calculator">
            <FieldsComponent onUpdate={callbacks.onFieldsUpdate} defaults={fieldsData}/>
            <Field title="Способ оплаты" containerOptions={{direction:"column"}}>
                <RadioButtonGroup options={props.executor.getPayMethods()} groupName="pay-method"
                                 onSelectionChange={newMethod => setPayMethod(newMethod)} value={payMethod}/>
            </Field>
            <span className={"economical-calculator-button"}><ActionButton title={errMsg || "Посчитать"} onClick={callbacks.onSubmit} /></span>
        </div>
    );
};

export default PurchaseCalculator;