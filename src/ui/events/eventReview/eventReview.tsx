import React, {useState} from 'react';
import ContentTitle from "../../../components/static/contentTitle/contentTitle";
import TextInput from "../../../components/dynamic/textInput/textInput";
import TextAreaReadOnly from "../../../components/dynamic/textAreaReadOnly/textAreaReadOnly";

enum usingFields {
    reviewer_profile = "Ссылка на профиль",
    reviewer_discord = "Discord"
}

const EventReview = () => {
    const [review, setReview] = useState('Заполните все поля и нажмите "Создать вердикт" для получения кода.')
    return (
        <ContentTitle title="Генерация вердикта">
            <TextInput title={usingFields.reviewer_profile} maxLength={128} placeholder="https://rp-wow.ru/users/1018" cacheKey="profileLink" handler={() => console.log('')}/>
            <TextInput title={usingFields.reviewer_discord} maxLength={128} placeholder="rolevik dima#4300" cacheKey="discordProfile" handler={() => console.log('')}/>
            <TextAreaReadOnly review={review}></TextAreaReadOnly>
        </ContentTitle>
    );
};

export default EventReview;