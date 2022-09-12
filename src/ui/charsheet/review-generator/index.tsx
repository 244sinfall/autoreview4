import React, {useEffect, useState} from 'react';
import ContentTitle from "../../../components/static/content-title";
import TextInput from "../../../components/dynamic/text-input";
import {useAppDispatch, useAppSelector} from "../../../model/hooks";
import TextAreaReadOnly from "../../../components/dynamic/text-area-read-only";
import {
    CharsheetReviewResponse,
    getReview, isFieldsFilled,
    ReviewFields,
    setCharName,
    setReviewerDiscord,
    setReviewerProfile
} from "../../../model/charsheets/charsheet-review";
import ActionButton from "../../../components/static/action-button";
import './style.css'

const CharsheetReviewGenerator = () => {
    const state = useAppSelector((state) => state.charsheet);
    const dispatch = useAppDispatch();
    const [review, setReview] = useState<CharsheetReviewResponse>({review: ""})
    const [reviewCopied, setReviewCopied] = useState(false)
    const [showCopyButton, setShowCopyButton] = useState(false)
    const [errMsg, setErrMsg] = useState("")

    useEffect(() => setShowCopyButton(false), [state])
    const manageReviewFields = (fieldName: string, fieldValue: string) => {
        if(fieldName === ReviewFields.charName)
            return dispatch(setCharName(fieldValue))
        if(fieldName === ReviewFields.reviewerProfile)
            return dispatch(setReviewerProfile(fieldValue))
        if(fieldName === ReviewFields.reviewerDiscord)
            return dispatch(setReviewerDiscord(fieldValue))
    }
    const handleCopy = () => {
        setReviewCopied(true)
        setTimeout(() => setReviewCopied(false), 1000)
        return navigator.clipboard.writeText(review.review)
    }
    const setError = (message: string) => {
        setErrMsg(message)
        setTimeout(() => setErrMsg(""), 1000)
    }
    const handleGenerate = async() => {
        if(!isFieldsFilled(state)) return setError("Поля не заполнены")
        return getReview(state)
            .then((review) => {
                setShowCopyButton(true)
                setReview({review: review.review})
            })
            .catch((reason) => setError(reason.message))
    }
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
            <ContentTitle title="Генерация вердикта">
                <TextInput title={ReviewFields.reviewerProfile} maxLength={128} placeholder="https://rp-wow.ru/users/1018" cacheKey="profileLink" handler={manageReviewFields}/>
                <TextInput title={ReviewFields.reviewerDiscord} maxLength={128} placeholder="rolevik dima#4300" cacheKey="discordProfile" handler={manageReviewFields}/>
                <TextInput title={ReviewFields.charName} maxLength={32} placeholder="Васян" handler={manageReviewFields}/>
                {!showCopyButton && <ActionButton title={errMsg ? errMsg : "Создать вердикт"} show={true} action={handleGenerate} tooltip={rules} requiresLoading={true}/>}
                {showCopyButton && <ActionButton title={reviewCopied ? 'Вердикт скопирован' : 'Скопировать вердикт'} show={showCopyButton} action={handleCopy} requiresLoading={false}/>}
                <TextAreaReadOnly content={review.review}></TextAreaReadOnly>
            </ContentTitle>
        </div>
    );
};

export default CharsheetReviewGenerator;