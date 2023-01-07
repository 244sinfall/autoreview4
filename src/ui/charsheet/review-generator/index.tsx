import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../../model/hooks";
import {setCharName, setReviewerDiscord, setReviewerProfile} from "../../../model/charsheets/reducer";
import CharsheetReviewTemplate from "../../../model/charsheets";
import ReviewGenerator from "../../../components/charsheet/review/review-generator";

const CharsheetReviewGenerator = () => {
    const state = useAppSelector((state) => state.charsheet);
    const dispatch = useAppDispatch();
    const [review, setReview] = useState("")
    const [copied, setCopied] = useState(false)
    const [errMsg, setErrMsg] = useState("")
    const setError = (message: string) => {
        setErrMsg(message)
        setTimeout(() => setErrMsg(""), 1000)
    }
    const callbacks = {
        onProfileLinkChange: useCallback((newLink: string) => dispatch(setReviewerProfile(newLink)), [dispatch]),
        onDiscordChange: useCallback((newDiscord: string) => dispatch(setReviewerDiscord(newDiscord)), [dispatch]),
        onCharNameChange: useCallback((newCharName: string) => dispatch(setCharName(newCharName)), [dispatch]),
    }

    const onGenerate = useCallback(async() => {
        if(review) {
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
            return navigator.clipboard.writeText(review)
        }
        try {
            const reviewer = new CharsheetReviewTemplate(state)
            const review = await reviewer.getReview()
            return setReview(review)
        } catch (e: unknown) {
            if(e instanceof Error) return setError(e.message);
        }
    }, [review, state])

    const buttonMessage = useMemo(() => {
        if(errMsg) return errMsg
        if(!review) return "Создать вердикт"
        return copied ? "Вердикт скопирован" : "Скопировать вердикт"
    }, [copied, errMsg, review])

    useEffect(() => {
        setCopied(false)
        setReview("")
    }, [state])

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
        <ReviewGenerator review={review}
                         tooltip={rules}
                         buttonMessage={buttonMessage}
                         onButton={onGenerate}
                         callbacks={callbacks}
                         charName={state.charName}
                         discord={state.reviewerDiscord}
                         profileLink={state.reviewerProfile}/>
    );
};

export default React.memo(CharsheetReviewGenerator);