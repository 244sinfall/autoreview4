import React, {useCallback, useEffect, useMemo, useState} from 'react';
import ContentTitle from "../../../components/static/content-title";
import TextInput from "../../../components/dynamic/text-input";
import {useAppDispatch, useAppSelector} from "../../../model/hooks";
import TextAreaReadOnly from "../../../components/dynamic/text-area-read-only";
import ActionButton from "../../../components/static/action-button";
import './style.css'
import {setCharName, setReviewerDiscord, setReviewerProfile} from "../../../model/charsheets/reducer";
import CharsheetReviewTemplate from "../../../model/charsheets";

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
        handleFields: useCallback((fieldName: string, fieldValue: string) => {
            switch(fieldName) {
                case "Ссылка на профиль": return dispatch(setReviewerProfile(fieldValue))
                case "Discord": return dispatch(setReviewerDiscord(fieldValue))
                case "Ник проверяемого персонажа": return dispatch(setCharName(fieldValue))
            }
        }, [dispatch]),
        handleButton: useCallback(async() => {
            if(review) {
                setCopied(true)
                setTimeout(() => setCopied(false), 1500)
                return navigator.clipboard.writeText(review)
            } else {
                try {
                    const reviewer = new CharsheetReviewTemplate(state)
                    const review = await reviewer.getReview()
                    return setReview(review)
                } catch (e: any) {
                    setError(e.message)
                }
            }
        }, [review, state]),
    }
    const buttonMessage = useMemo(() => {
        if(errMsg) return errMsg
        if(review) {
            return copied ? "Вердикт скопирован" : "Скопировать вердикт"
        }
        return "Создать вердикт"
    }, [copied, errMsg, review])
    useEffect(() => {
        setCopied(false)
        setReview("")
    }, [state])
    const rules =
        "Вам нужно будет отредактировать вердикт, приводя<br/>" +
        'примеры и доводы, отсылаясь к содержанию анкеты.<br/>' +
        'В случае генерации вердикта на одобрение вам <br/>' +
        'необходимо будет оставить коментарии в/после <br/>' +
        'фрагментов, выделенных жирным шрифтом. В случае <br/>' +
        'генерации вердикта на отказ, жирным будут выделены <br/>' +
        'причины. Вам нужно дополнить их отсылками к тексту анкеты.';
    return (
        <div className="review-generator">
            <ContentTitle title="Генерация вердикта" controllable={false}>
                <TextInput title="Ссылка на профиль" maxLength={128} 
                           placeholder="https://rp-wow.ru/users/1018" cacheKey="profileLink" 
                           handler={callbacks.handleFields}/>
                <TextInput title="Discord" maxLength={128} placeholder="rolevik dima#4300" 
                           cacheKey="discordProfile" handler={callbacks.handleFields}/>
                <TextInput title="Ник проверяемого персонажа" maxLength={32} placeholder="Васян" 
                           handler={callbacks.handleFields}/>
                <ActionButton title={buttonMessage} show={true} action={callbacks.handleButton}
                              tooltip={rules} requiresLoading={true}/>
                <TextAreaReadOnly content={review}></TextAreaReadOnly>
            </ContentTitle>
        </div>
    );
};

export default CharsheetReviewGenerator;