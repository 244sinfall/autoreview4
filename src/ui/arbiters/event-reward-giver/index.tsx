import React, {useCallback, useRef, useState} from 'react';
import {EventRewardDistributor, EventRewardDistributorImpl}
    from "../../../model/arbiters/event-reward-distributor";
import EventRewardMacroMaker from "../../../components/arbiters/event-reward-macro-maker";

const EventRewardGiver = () => {
    const [rewardWorkerResponse, setRewardWorkerResponse] = useState("")
    const [errMsg, setErrMsg] = useState<string>("")
    const [isTextParted, setIsTextParted] = useState(false)

    const distributor = useRef(new EventRewardDistributorImpl())

    const callbacks = {
        executeDistribution: useCallback(async(info: EventRewardDistributor) => {
            try {
                distributor.current.setInfo(info)
                const response = await distributor.current.run()
                if (isTextParted) setIsTextParted(false)
                return setRewardWorkerResponse(response)
            } catch (e: any) {
                setErrMsg(e.message)
                setTimeout(() => setErrMsg(""), 1500)
            }
        }, [isTextParted]),
        splitCommandsToFitMacro: useCallback(() => {
            setRewardWorkerResponse((prevState) => {
                let separateCounter = 0
                return prevState.split("\n").map((str) => {
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
            })
            setIsTextParted(true)
        }, [])
    }

    return (
        <EventRewardMacroMaker onSubmit={callbacks.executeDistribution}
                               result={rewardWorkerResponse}
                               buttonMessage={errMsg || "Обработать"}
                               onSplit={callbacks.splitCommandsToFitMacro}
                               shouldSplit={(rewardWorkerResponse && !isTextParted) || false}/>
    );
};

export default React.memo(EventRewardGiver);