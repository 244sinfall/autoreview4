import React from 'react';
import NumberInput from "../../../common/number-input";
import './styles.css'
import Field from "../../../common/field";

type RateCounterTotalRateProps = {
    title: string
    value: number
}

const RateCounterTotalRate = (props: RateCounterTotalRateProps) => {
    return (
        <Field className={'rate-counter__total-rate rate-counter__rate '} title="Общая оценка">
            <NumberInput className={'rate-counter__total-value'} value={props.value} disabled={true}/>
        </Field>
    );
};

export default React.memo(RateCounterTotalRate);