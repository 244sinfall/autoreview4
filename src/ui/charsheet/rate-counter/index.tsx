import React, {useCallback} from 'react';
import ContentTitle from "../../../components/common/content-title";
import {useAppDispatch, useAppSelector} from "../../../services/services/store";
import {updateRates} from "../../../model/charsheets/reducer";
import RateCounterRate from "../../../components/charsheet/rate-counter/rate";
import RateCounterTotalRate from "../../../components/charsheet/rate-counter/total-rate";

const CharsheetReviewRateCounter = (props: { rateMin: number, rateMax: number }) => {
    const state = useAppSelector((state) => state.charsheet);
    const dispatch = useAppDispatch();
    const callbacks = {
        updateRate: useCallback((name: string, value: number) => dispatch(updateRates({rateName: name, rateValue: value})),
            [dispatch])
    }
    return (
        <ContentTitle title="Критерии оценки" collapsable={false}>
            {state.rates.map(rate => <RateCounterRate key={rate.rateName}
                                                      rateName={rate.rateName}
                                                      rateValue={rate.rateValue}
                                                      minRate={props.rateMin}
                                                      maxRate={props.rateMax}
                                                      onChange={(v) => callbacks.updateRate(rate.rateName, v)} />)}
            <RateCounterTotalRate title="Общая оценка" value={state.totalRate}/>
        </ContentTitle>

    );
};



export default React.memo(CharsheetReviewRateCounter);
