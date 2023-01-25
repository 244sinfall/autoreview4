import React, {useCallback} from 'react';
import {BusinessRewardInfo} from "../../../model/arbiters/business/types";
import BusinessReward from "../../../components/arbiters/business-reward";
import {useAppDispatch, useAppSelector} from "../../../services/services/store";
import {setCommand, setFields} from "../../../model/arbiters/business/reducer";

const BusinessActivityRewardGiver = () => {
    const dispatch = useAppDispatch()
    const state = useAppSelector(state => state.business)
    const callbacks = {
        onChange: useCallback(<K extends keyof BusinessRewardInfo, V extends BusinessRewardInfo[K]>(key: K, value: V) => {
            dispatch(setFields({...state.info, [key]: value}))
        }, [dispatch, state.info]),
        createCommand: useCallback(() => {
            dispatch(setCommand())
        }, [dispatch]),
    }
    return (
        <BusinessReward result={state.command}
                        buttonText={state.error || "Создать комманду"}
                        info={state.info}
                        onChange={callbacks.onChange}
                        onSubmit={callbacks.createCommand}/>
    );
};

export default React.memo(BusinessActivityRewardGiver);