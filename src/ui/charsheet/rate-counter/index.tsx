import React, {useCallback, useEffect, useMemo} from 'react';
import ContentTitle from "../../../components/static/content-title";
import NumberInput from "../../../components/dynamic/number-input";
import {useAppDispatch, useAppSelector} from "../../../model/hooks";
import './style.css'
import {Rate} from "../../../model/charsheets";
import {setRates, updateRates} from "../../../model/charsheets/reducer";

const CharsheetReviewRateCounter = (props: { rateNames: string[], rateMin: number, rateMax: number }) => {
    const state = useAppSelector((state) => state.charsheet);
    const dispatch = useAppDispatch();
    useEffect(() => {
        let ratesArray: Rate[] = []
        props.rateNames.forEach(rate => ratesArray.push({rateName: rate, rateValue: 0}))
        dispatch(setRates(ratesArray))
    }, [dispatch, props.rateNames])
    const totalRate = useMemo(() => {
        if(!state.rates) return 0
        let acc = 0
        state.rates.forEach((value) => acc += value.rateValue)
        return acc === 0 ? 0 : Math.floor(acc/state.rates.length)
    }, [state.rates])
    const callbacks = {
        updateRate: useCallback((rateName: string, rateValue: number) => {
            dispatch(updateRates({rateName: rateName, rateValue: rateValue}))
        }, [dispatch])
    }
    return (
        <div className="rate-counter">
            <ContentTitle title="Критерии оценки" controllable={false}>
                {props.rateNames.map((rate) => {
                    return <NumberInput key={rate} title={rate} handler={callbacks.updateRate}
                                        minValue={props.rateMin} maxValue={props.rateMax} disabled={false}/>})}
                <NumberInput title={"Общая оценка"} minValue={0} maxValue={10}
                             disabled={true} defaultValue={totalRate}/>
            </ContentTitle>
        </div>
    );
};



export default CharsheetReviewRateCounter;
