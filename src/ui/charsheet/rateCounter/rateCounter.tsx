import React, {useEffect} from 'react';
import ContentTitle from "../../../components/static/contentTitle/contentTitle";
import NumberInput from "../../../components/dynamic/numberInput/numberInput";
import {updateRates, setRates, Rate} from "../../../model/charsheets/charsheetReview";
import {useAppDispatch, useAppSelector} from "../../../model/hooks";

const RateCounter = (props: { rateNames: string[], rateMin: number, rateMax: number }) => {
    const state = useAppSelector((state) => state.charsheet);
    const dispatch = useAppDispatch();
    let rateInputs: React.ReactNode[] = [];
    useEffect(() => {
        if(state.rates.length !== props.rateNames.length) {
            let initialRates: Rate[] = []
            props.rateNames.forEach(value => {
                initialRates.push({rateName: value, rateValue: 0})
            })
            dispatch(setRates(initialRates))
        }
    }, [props, dispatch, state.rates.length])
    props.rateNames.forEach((value) => {
        rateInputs.push(<NumberInput key={value} title={value} handler={updateStateWithNewValues} minValue={props.rateMin} maxValue={props.rateMax} disabled={false}/>);
    })
    function updateStateWithNewValues(rateName: string, rateValue: number) {
        if(state.rates.filter(value => value.rateName === rateName && value.rateValue === rateValue).length === 0) {
            dispatch(updateRates({rateName: rateName, rateValue: rateValue}))
        }
    }

    return (
        <div className="rateCounter">
            <ContentTitle title="Критерии оценки:">
                {rateInputs}
                <NumberInput title={"Общая оценка"} minValue={0} maxValue={10} disabled={true} disabledValue={state.totalRate}/>
            </ContentTitle>
        </div>
    );
};



export default RateCounter;
