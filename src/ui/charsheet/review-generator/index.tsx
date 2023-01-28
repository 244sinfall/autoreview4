import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../../services/services/store";
import {
    generateCharsheetTemplate,
    setCharName,
    setReviewerDiscord,
    setReviewerProfile
} from "../../../model/charsheets/reducer";
import ReviewGenerator from "../../../components/charsheet/review/review-generator";

const CharsheetReviewGenerator = () => {
    const state = useAppSelector((state) => state.charsheet);
    const dispatch = useAppDispatch();
    const [copied, setCopied] = useState(false)
    const callbacks = {
        onProfileLinkChange: useCallback((newLink: string) => dispatch(setReviewerProfile(newLink)), [dispatch]),
        onDiscordChange: useCallback((newDiscord: string) => dispatch(setReviewerDiscord(newDiscord)), [dispatch]),
        onCharNameChange: useCallback((newCharName: string) => dispatch(setCharName(newCharName)), [dispatch]),
        onGenerate: useCallback(async() => {
            if(state.result) {
                setCopied(true)
                setTimeout(() => setCopied(false), 1500)
                return await navigator.clipboard.writeText(state.result)
            }
            await dispatch(generateCharsheetTemplate())
            setCopied(false)
        }, [dispatch, state.result])
    }

    const buttonMessage = useMemo(() => {
        if(state.error) return state.error
        if(!state.result) return "Создать вердикт"
        return copied ? "Вердикт скопирован" : "Скопировать вердикт"
    }, [copied, state.error, state.result])

    useEffect(() => {
        setCopied(false)
    }, [])

    const rules = useMemo(() =>
        "Вам нужно будет отредактировать вердикт, приводя<br/>" +
        'примеры и доводы, отсылаясь к содержанию анкеты.<br/>' +
        'В случае генерации вердикта на одобрение вам <br/>' +
        'необходимо будет оставить коментарии в/после <br/>' +
        'фрагментов, выделенных жирным шрифтом. В случае <br/>' +
        'генерации вердикта на отказ, жирным будут выделены <br/>' +
        'причины. Вам нужно дополнить их отсылками к тексту анкеты.',
        [])

    return (
        <ReviewGenerator review={state.result}
                         tooltip={rules}
                         buttonMessage={buttonMessage}
                         onButton={callbacks.onGenerate}
                         callbacks={callbacks}
                         charName={state.info.charName}
                         discord={state.info.reviewerDiscord}
                         profileLink={state.info.reviewerProfile}/>
    );
};

export default React.memo(CharsheetReviewGenerator);