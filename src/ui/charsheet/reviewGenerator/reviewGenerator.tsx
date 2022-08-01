import React, {useEffect, useState} from 'react';
import ContentTitle from "../../../components/static/contentTitle/contentTitle";
import TextInput from "../../../components/dynamic/textInput/textInput";
import {useAppDispatch, useAppSelector} from "../../../model/hooks";
import TextAreaReadOnly from "../../../components/dynamic/textAreaReadOnly/textAreaReadOnly";
import GenerateReviewButtons from "../generateReviewButtons/generateReviewButtons";
import {setCharName, setReviewerDiscord, setReviewerProfile} from "../../../model/charsheets/charsheetReview";


enum usingFields {
    charName = "Ник проверяемого персонажа",
    reviewerProfile = "Ссылка на профиль",
    reviewerDiscord = "Discord"
}

export enum ReviewButtonTypes {
    createReviewTitle = "Создать вердикт",
    copyReviewTitle = "Скопировать вердикт"
}

const ReviewGenerator = () => {

    const state = useAppSelector((state) => state.charsheet);
    const [review, setReview] = useState('Заполните все поля и нажмите "Создать вердикт" для получения кода.')
    const [reviewExist, setReviewExistence] = useState(false)
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setCharName(""))
    }, [])
    useEffect(() => {
        if(reviewExist) {
            setReviewExistence(false)
        }
            }, [state])
    function manageReviewFields(fieldName: string, fieldValue: string) {
        switch(fieldName) {
            case usingFields.charName:
                dispatch(setCharName(fieldValue));
                break;
            case usingFields.reviewerProfile:
                dispatch(setReviewerProfile(fieldValue));
                break;
            case usingFields.reviewerDiscord:
                dispatch(setReviewerDiscord(fieldValue));
                break;
            default:
                break;
        }
    }
    function updateReview(buttonTitle: string, newReview: string) {
        switch (buttonTitle) {
            case ReviewButtonTypes.createReviewTitle:
                setReview(newReview)
                if(newReview !== 'Не удалось получить вердикт') {
                    setReviewExistence(true)
                }
                break;
            case ReviewButtonTypes.copyReviewTitle:
                return navigator.clipboard.writeText(review)
            default:
                break;
        }

    }
    return (
        <div className="reviewGenerator">
            <ContentTitle title="Генерация вердикта">
                <TextInput title={usingFields.reviewerProfile} maxLength={128} placeholder="https://rp-wow.ru/users/1018" cacheKey="profileLink" handler={manageReviewFields}/>
                <TextInput title={usingFields.reviewerDiscord} maxLength={128} placeholder="rolevik dima#4300" cacheKey="discordProfile" handler={manageReviewFields}/>
                <TextInput title={usingFields.charName} maxLength={32} placeholder="Васян" handler={manageReviewFields}/>
                <GenerateReviewButtons reviewExist={reviewExist} handler={updateReview}/>
                <TextAreaReadOnly review={review}></TextAreaReadOnly>
            </ContentTitle>
        </div>
    );
};

export default ReviewGenerator;