import React, {useEffect} from 'react';
import ContentTitle from "../../../components/static/content-title";
import NumberInput from "../../../components/dynamic/number-input";
import {updateRates, Rate, setRates} from "../../../model/charsheets/charsheet-review";
import {useAppDispatch, useAppSelector} from "../../../model/hooks";
import './style.css'

const CharsheetReviewRateCounter = (props: { rateNames: string[], rateMin: number, rateMax: number }) => {
    const state = useAppSelector((state) => state.charsheet);
    const dispatch = useAppDispatch();
    useEffect(() => {
        let ratesArray: Rate[] = []
        props.rateNames.forEach(rate => ratesArray.push({rateName: rate, rateValue: 0}))
        dispatch(setRates(ratesArray))
    }, [dispatch, props.rateNames])
    function updateStateWithNewValues(rateName: string, rateValue: number) {
        if(state.rates.filter(value => value.rateName === rateName && value.rateValue === rateValue).length === 0) {
            dispatch(updateRates({rateName: rateName, rateValue: rateValue}))
        }
    }

    return (
        <div className="rate-counter">
            <ContentTitle title="Критерии оценки">
                {props.rateNames.map((rate) => {
                    return <NumberInput key={rate} title={rate} handler={updateStateWithNewValues}
                                        minValue={props.rateMin} maxValue={props.rateMax} disabled={false}/>})}
                <NumberInput title={"Общая оценка"} minValue={0} maxValue={10}
                             disabled={true} disabledValue={state.totalRate}/>
            </ContentTitle>
        </div>
    );
};



export default CharsheetReviewRateCounter;
