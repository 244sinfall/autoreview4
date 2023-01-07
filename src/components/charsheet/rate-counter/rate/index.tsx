import React from 'react';
import NumberInput from "../../../common/number-input";
import './styles.css'
import Field from "../../../common/field";

type RateCounterRateProps = {
    rateName: string
    rateValue: number
    minRate: number
    maxRate: number
    onChange: (newRate: number) => void
}

const RateCounterRate = (props: RateCounterRateProps) => {
    return (
        <Field className="rate-counter__rate" title={props.rateName}>
            <NumberInput className="rate-counter__rate-value" onChange={props.onChange} value={props.rateValue} maxValue={props.maxRate} minValue={props.minRate}/>
        </Field>
    );
};

export default React.memo(RateCounterRate);