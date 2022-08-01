import React, {useState} from 'react';
import ActionButton from "../../../components/static/actionButton/actionButton";
import './generateReviewButtons.css'
import {useAppSelector} from "../../../model/hooks";
import {CharsheetReviewState, getReview} from "../../../model/charsheets/charsheetReview";
import {ReviewButtonTypes} from "../reviewGenerator/reviewGenerator";

function areFieldsFilled(charsheetScheme: CharsheetReviewState) {
    return charsheetScheme.charName !== "" && charsheetScheme.reviewerDiscord !== "" &&
        charsheetScheme.reviewerProfile !== ""
}


const GenerateReviewButtons = (props: { reviewExist: boolean, handler: (buttonTitle: string, reviewResponse: string) => Promise<void> | undefined }) => {
    const rules =
        "Вам нужно будет отредактировать вердикт, приводя<br/>" +
        'примеры и доводы, отсылаясь к содержанию анкеты.<br/>' +
        'В случае генерации вердикта на одобрение вам <br/>' +
        'необходимо будет оставить коментарии в/после <br/>' +
        'фрагментов, выделенных жирным шрифтом. В случае <br/>' +
        'генерации вердикта на отказ, жирным будут выделены <br/>' +
        'причины. Вам нужно дополнить их отсылками к тексту анкеты.';
    const state = useAppSelector((state) => state)
    const [copied, setCopied] = useState(false)
    const [fieldsCorrect, setFieldsCorrect] = useState(true)

    async function generateEvent() {
        if(areFieldsFilled(state.charsheet)) {
            props.handler(ReviewButtonTypes.createReviewTitle, await getReview(state.charsheet))
        }
        else {
            setFieldsCorrect(false)
            setTimeout(() => setFieldsCorrect(true), 1000)
        }

    }

    function copyReviewEvent() {
        props.handler(ReviewButtonTypes.copyReviewTitle, '')?.finally(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 500)
        })
    }

    return (
        <div className='generateReviewButtons'>
            <ActionButton title={fieldsCorrect ? "Создать вердикт" : "Поля не заполнены"} show={!props.reviewExist} action={generateEvent} tooltip={rules} requiresLoading={true}/>
            <ActionButton title={copied ? 'Вердикт скопирован' : 'Скопировать вердикт'} show={props.reviewExist} action={copyReviewEvent} requiresLoading={false}/>
        </div>
    );
};


export default GenerateReviewButtons;