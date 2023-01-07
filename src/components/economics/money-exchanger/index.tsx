import React, {useCallback, useMemo} from 'react';
import ContentTitle from "../../common/content-title";
import LayoutGrid from "../../common/layouts/grid";
import Field from "../../common/field";
import NumberInput from "../../common/number-input";

export type DarkmoonMoney = {
    gold: number,
    silver: number,
    copper: number
}

type MoneyExchangerProps = {
    onExpandedMoneyChange: (newExpandedMoney: DarkmoonMoney) => void
    onShortMoneyChange: (newShortMoney: number) => void,
    expandedMoney: DarkmoonMoney,
    shortMoney: number
}

const MoneyExchanger = (props: MoneyExchangerProps) => {
    const callbacks = {
        onExpandedMoneyChange: useCallback((key: keyof DarkmoonMoney, val: number) => {
            props.onExpandedMoneyChange({...props.expandedMoney, [key]: val})
        }, [props]),
        onShortMoneyChange: useCallback((val: number) => {
            props.onShortMoneyChange(val)
        }, [props])
    }
    const containerOptions = useMemo(() => ({collapsedOptions: {widthToCollapse: 450}}), [])
    return (
        <ContentTitle title="Конвертировать деньги" collapsable={true}>
            <LayoutGrid>
                <Field title="Золото" containerOptions={containerOptions}>
                    <NumberInput onChange={(val) => callbacks.onExpandedMoneyChange("gold", val)}
                                 minValue={0} maxValue={9999999} value={props.expandedMoney.gold}/>
                </Field>
                <Field title="Серебро" containerOptions={containerOptions}>
                    <NumberInput onChange={(val) => callbacks.onExpandedMoneyChange("silver", val)}
                                 minValue={0} maxValue={99} value={props.expandedMoney.silver}/>
                </Field>
                <Field title="Медь" containerOptions={containerOptions}>
                    <NumberInput onChange={(val) => callbacks.onExpandedMoneyChange("copper", val)}
                                 minValue={0} maxValue={99} value={props.expandedMoney.copper}/>
                </Field>
                <hr/>
                <Field title="Только медь" containerOptions={containerOptions}>
                    <NumberInput onChange={callbacks.onShortMoneyChange} minValue={0}
                                 maxValue={999999999999999} value={props.shortMoney}/>
                </Field>
            </LayoutGrid>
        </ContentTitle>
    );
};

export default React.memo(MoneyExchanger);