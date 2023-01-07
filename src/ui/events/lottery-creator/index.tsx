import React, {useCallback, useRef, useState} from 'react';
import {LotteryCreatorImpl, LotteryRequest,} from "../../../model/events/event-lottery";
import Lottery from "../../../components/events/lottery";

const LotteryCreator = () => {

    const creator = useRef(new LotteryCreatorImpl());

    const [result, setResult] = useState("")

    const [errMsg, setErrMsg] = useState("")

    const callbacks = {
        onSubmit: useCallback(async(info: LotteryRequest) => {
            creator.current.setInfo(info)
            try {
                const text = await creator.current.run()
                setResult(text)
            } catch (e: unknown) {
                if(e instanceof Error) setErrMsg(e.message)
                setTimeout(() => setErrMsg(""), 1500)
            }

        }, [])
    }

    return (
        <Lottery result={result} onSubmit={callbacks.onSubmit} buttonText={errMsg || "Разыграть"}/>
    );
};

export default LotteryCreator;