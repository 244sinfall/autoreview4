import React, {useCallback, useState} from 'react';
import {DarkmoonMoney} from "../../../components/economics/money-exchanger";
import MoneyExchanger from "../../../components/economics/money-exchanger";

const MoneyConverter = () => {
    const [copperMoney, setCopperMoney] = useState(0)

    const [realMoney, setRealMoney] = useState<DarkmoonMoney>({gold: 0, silver: 0, copper: 0})

    const callbacks = {
        onRealMoneyChange: useCallback((realMoney: DarkmoonMoney) => {
            setRealMoney(realMoney)
            setCopperMoney(realMoney.gold * 10000 + realMoney.silver * 100 + realMoney.copper)
        }, []),
        onCopperMoneyChange: useCallback((copperMoney: number) => {
            setCopperMoney(copperMoney)
            const newMoney: DarkmoonMoney = {gold: 0, silver: 0, copper: 0}
            if(copperMoney > 10000) {
                newMoney.gold = Math.floor(copperMoney / 10000)
                copperMoney = copperMoney % 10000
            }
            if(copperMoney > 100) {
                newMoney.silver = Math.floor(copperMoney / 100)
                copperMoney = copperMoney % 100
            }
            newMoney.copper = copperMoney
            setRealMoney(newMoney)
        }, [])
    }
    return (
        <MoneyExchanger expandedMoney={realMoney}
                        onExpandedMoneyChange={callbacks.onRealMoneyChange}
                        onShortMoneyChange={callbacks.onCopperMoneyChange}
                        shortMoney={copperMoney}/>
    );
};

export default React.memo(MoneyConverter);