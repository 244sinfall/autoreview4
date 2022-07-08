import React, {useEffect, useState} from 'react';
import ContentTitle from "../../../components/static/contentTitle/contentTitle";
import TextInput from "../../../components/dynamic/textInput/textInput";
import {useAppDispatch, useAppSelector} from "../../../model/hooks";
import {updateFields} from "../../../model/charsheets/charsheetReview";
import TextArea from "../../../components/dynamic/textArea/textArea";
import GenerateReviewButtons from "../generateReviewButtons/generateReviewButtons";


enum usingFields {
    char_name = "Ник проверяемого персонажа",
    reviewer_profile = "Ссылка на профиль",
    reviewer_discord = "Discord"
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
        if(reviewExist) {
            setReviewExistence(false)
        }
            }, [state])
    // const rules = 'Вам нужно будет отредактировать вердикт,<br/>' +
    //     'приведя примеры и доводы, отсылаясь к анкете.<br>\n' +
    //     'В случае генерации вердикта <strong>на одобрение</strong>,<br/>' +
    //     'вам необходимо будет оставить коментарии в/после фрагментов,<br/>' +
    //     'выделенных жирным шрифтом.<br>' +
    //     'В случае генерации вердикта <strong>на отказ</strong>,</br>' +
    //     'жирным будут выделены причины. Вам нужно дополнить их<br/>' +
    //     'отсылками к тексту анкеты.<br>';
    function manageReviewFields(fieldName: string, fieldValue: string) {
        switch(fieldName) {
            case usingFields.char_name:
                dispatch(updateFields({ fieldName: "char_name", fieldValue: fieldValue}));
                break;
            case usingFields.reviewer_profile:
                dispatch(updateFields({ fieldName: "reviewer_profile", fieldValue: fieldValue}));
                break;
            case usingFields.reviewer_discord:
                dispatch(updateFields({ fieldName: "reviewer_discord", fieldValue: fieldValue}));
                break;
            default:
                dispatch(updateFields({ fieldName: fieldName, fieldValue: fieldValue}));
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
            <ContentTitle title="Генерация вердикта:">
                <TextInput title={usingFields.reviewer_profile} placeholder="https://rp-wow.ru/users/1018" cacheKey="profileLink" handler={manageReviewFields}/>
                <TextInput title={usingFields.reviewer_discord} placeholder="rolevik dima#4300" cacheKey="discordProfile" handler={manageReviewFields}/>
                <TextInput title={usingFields.char_name} placeholder="Васян" handler={manageReviewFields}/>
                <GenerateReviewButtons reviewExist={reviewExist} handler={updateReview}/>
                <TextArea review={review}></TextArea>
            </ContentTitle>
        </div>
    );
};

export default ReviewGenerator;