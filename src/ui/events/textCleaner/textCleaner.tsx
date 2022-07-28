import React, {useState} from 'react';
import ContentTitle from "../../../components/static/contentTitle/contentTitle";
import TextAreaReadOnly from "../../../components/dynamic/textAreaReadOnly/textAreaReadOnly";
import './textCleaner.css'
import TextAreaWritable from "../../../components/dynamic/textAreaWritable/textAreaWritable";
import ActionButton from "../../../components/static/actionButton/actionButton";
import {APIAddress, cleanParticipantsTextEndPoint} from "../../../config/api";

const TextCleaner = () => {
    const [rawText, setRawText] = useState("")
    const [cleanedText, setCleanedText] = useState("")
    async function cleanParticipantsText() {
        if(rawText !== "") {
            return await fetch(APIAddress + cleanParticipantsTextEndPoint, {
                method: "POST",
                headers: {
                    "Accept": "application/octet-stream"
                },
                body: JSON.stringify({
                    "RawText": rawText
                })
            })
                .then((response) => response.json())
                .then((json) => {
                    if(json["error"]) {
                        throw json
                    }
                    else {
                        setCleanedText("Очищенный список:\n" + json["cleanedText"] + "\nИзменены строки:\n" + json["editedLines"])
                    }
                })
                .catch(() => {
                    return
                })
        }
    }
    function handleRawTextChange(changedText: string) {
        if(rawText !== changedText) {
            setRawText(changedText)
        }
    }
    return (

        <ContentTitle title='Очистка текста'>
            <div className='text-cleaner'>
                <div className='text-cleaner__raw'>
                    <TextAreaWritable height={300} recorder={handleRawTextChange}></TextAreaWritable>
                    <ActionButton title='Очистить текст' show={true} action={cleanParticipantsText} tooltip={'asdasd'} requiresLoading={true}/>
                </div>
                <TextAreaReadOnly review={cleanedText}></TextAreaReadOnly>
            </div>
        </ContentTitle>

    );
};

export default TextCleaner;