import React, {useCallback, useRef, useState} from 'react';
import {BusinessActivityAggregator, BusinessRewardInfo} from "../../../model/arbiters/business-activity-aggregator";
import BusinessReward from "../../../components/arbiters/business-reward";

const BusinessActivityRewardGiver = () => {
    const [currentCommand, setCurrentCommand] = useState("")
    const [buttonText, setButtonText] = useState("Создать команду")
    const aggregator = useRef(new BusinessActivityAggregator())
    const callbacks = {
        createCommand: useCallback((info: BusinessRewardInfo) => {
            aggregator.current.setInfo(info)
            try {
                setCurrentCommand(aggregator.current.getCommand())
            } catch (e: unknown) {
                if(e instanceof Error)  {
                    setButtonText(e.message)
                    setTimeout(() => setButtonText("Создать команду"), 2000)
                }
            }

        }, []),
    }
    return (
        <BusinessReward result={currentCommand}
                        buttonText={buttonText}
                        onSubmit={callbacks.createCommand}/>
    );
};

export default React.memo(BusinessActivityRewardGiver);