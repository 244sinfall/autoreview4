import React, {useCallback, useState} from 'react';
import EventRewardMacroMaker from "../../../components/arbiters/event-reward-macro-maker";
import {useAppDispatch, useAppSelector} from "../../../services/services/store";
import {
    requestEventRewardDistribution,
    setDistributionMode,
    setEventLink, setEventRate, setParticipantsText, setResult
} from "../../../model/arbiters/event-rewards/reducer";

const EventRewardGiver = () => {
    const state = useAppSelector(state => state.eventReward)
    const dispatch = useAppDispatch()

    const [isTextParted, setIsTextParted] = useState(false)

    const callbacks = {
        executeDistribution: useCallback(async() => {
            await dispatch(requestEventRewardDistribution())
            setIsTextParted(false)
        }, [dispatch]),
        splitCommandsToFitMacro: useCallback(() => {
            const initial = state.result
            let separateCounter = 0
            const result = initial.split("\n").map((str) => {
                if (str.startsWith(".")) {
                    if (separateCounter + str.length <= 254) {
                        separateCounter += str.length
                        return str
                    }
                    separateCounter = str.length
                    return "\n" + str
                }
                return str
            }).join("\n")
            dispatch(setResult(result))
            setIsTextParted(true)
        }, [dispatch, state.result])
    }

    return (
        <EventRewardMacroMaker info={state}
                               onEventLinkChange={link => dispatch(setEventLink(link))}
                               onModeChange={mode => dispatch(setDistributionMode(mode))}
                               onRateChange={rate => dispatch(setEventRate(rate))}
                               onTextChange={text => dispatch(setParticipantsText(text))}
                               onSubmit={callbacks.executeDistribution}
                               result={state.result}
                               buttonMessage={state.error || "Обработать"}
                               onSplit={callbacks.splitCommandsToFitMacro}
                               shouldSplit={(state.result && !isTextParted) || false}/>
    );
};

export default React.memo(EventRewardGiver);