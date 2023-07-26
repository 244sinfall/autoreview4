import React, {useCallback, useState} from 'react';
import PowerToNpc, {PowerToNpcInput} from "../../../components/economics/power-to-npc";
import Limits from './limits'
import Price from './prices'
const PowerConverter = () => {
    const [convertedValue, setConvertedValue] = useState("")

    const callbacks = {
        onConvert: useCallback((info: PowerToNpcInput) => {
            const result = new Array<number>(Price.length).fill(0)
            let tempPower = info.power;
            let currentLevelOfNpc = Price.length - 1;
            const limit = Limits[info.level];
            while (tempPower >= 2) {
                if((limit[currentLevelOfNpc] !== null && result[currentLevelOfNpc] >= Number(limit[currentLevelOfNpc])) ||
                tempPower < Price[currentLevelOfNpc]) {
                    currentLevelOfNpc--;
                    continue;
                }
                tempPower -= Price[currentLevelOfNpc]
                result[currentLevelOfNpc] += 1
            }
            let resultStr = ''
            result.forEach((value, index) => {
                if(value > 0){
                    resultStr += `${value} НИП ${index + 1} уровня; `
                }
            })
            setConvertedValue(resultStr)
        }, []),
    }
    return (
        <PowerToNpc convertedValue={convertedValue} onConvert={callbacks.onConvert} />
    );
};

export default React.memo(PowerConverter);