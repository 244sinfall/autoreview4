import React, {useCallback,useState} from 'react';
import ContentTitle from "../../../components/common/static/content-title";
import NumberInput from "../../../components/common/dynamic/number-input";
import LayoutGrid from "../../../components/common/layouts/grid";

type DarkmoonMoney = {
    gold: number,
    silver: number,
    copper: number
}

const MoneyConverter = () => {
    const [copperMoney, setCopperMoney] = useState(0)
    const [realMoney, setRealMoney] = useState<DarkmoonMoney>({gold: 0, silver: 0, copper: 0})
    const updateCopper = (newMoney: DarkmoonMoney) => {
        setCopperMoney(newMoney.gold * 10000 + newMoney.silver * 100 + newMoney.copper)
    }
    const updateMoney = (newCopper: number) => {
        const newMoney: DarkmoonMoney = {gold: 0, silver: 0, copper: 0}
        if(newCopper > 10000) {
            newMoney.gold = Math.floor(newCopper / 10000)
            newCopper = newCopper % 10000
        }
        if(newCopper > 100) {
            newMoney.silver = Math.floor(newCopper / 100)
            newCopper = newCopper % 100
        }
        newMoney.copper = newCopper
        setRealMoney(newMoney)
    }
    const callbacks = {
        onMoneyChange: useCallback((fieldName: string, fieldValue: number) => {
            const newMoney = {...realMoney}
            let isReal = true
            switch (fieldName) {
                case "Золото": newMoney.gold = fieldValue; break;
                case "Серебро": newMoney.silver = fieldValue; break;
                case "Медь": newMoney.copper = fieldValue; break;
                default: isReal = false;
            }
            if(isReal) {
                setRealMoney(newMoney)
                updateCopper(newMoney)
            } else {
                setCopperMoney(fieldValue)
                updateMoney(fieldValue)
            }}, [realMoney]),
    }
    return (
        <ContentTitle title="Конвертировать деньги" controllable={true}>
            <LayoutGrid>
                <NumberInput title="Золото" handler={callbacks.onMoneyChange} minValue={0}
                             maxValue={9999999} floatable={false} disabled={false} value={realMoney.gold}/>
                <NumberInput title="Серебро" handler={callbacks.onMoneyChange} minValue={0}
                             maxValue={99} floatable={false} disabled={false} value={realMoney.silver}/>
                <NumberInput title="Медь" handler={callbacks.onMoneyChange} minValue={0}
                             maxValue={99} floatable={false} disabled={false} value={realMoney.copper}/>
                <hr/>
                <NumberInput title="Только медь" handler={callbacks.onMoneyChange} minValue={0}
                             maxValue={999999999999999} floatable={false} disabled={false} value={copperMoney}/>
            </LayoutGrid>
        </ContentTitle>
    );
};

export default React.memo(MoneyConverter);