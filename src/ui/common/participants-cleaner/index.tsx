import React, {useCallback, useState} from 'react';
import ContentTitle from "../../../components/static/content-title";
import './style.css'
import TextAreaWritable from "../../../components/dynamic/text-area-writable";
import ActionButton from "../../../components/static/action-button";
import {
    cleanParticipantsText,
    ParticipantsCleanerRequest,
    ParticipantsCleanerResponse
} from "../../../model/common/participants-cleaner";
import TextAreaReadOnly from "../../../components/dynamic/text-area-read-only";

const TextCleaner = () => {
    const [rawText, setRawText] = useState<ParticipantsCleanerRequest>({rawText: ""})
    const [cleanedText, setCleanedText] = useState<ParticipantsCleanerResponse>({cleanedText: "", editedLines: "", cleanedCount: 0})
    const [errMsg, setErrMsg] = useState("")
    const setError = (message: string) => {
        setErrMsg(message)
        setTimeout(() => setErrMsg(""), 1000)
    }
    const handleClean = useCallback(() => {
        return cleanParticipantsText(rawText)
            .then(response => setCleanedText(response))
            .catch(reason => setError(reason.message))
    }, [rawText])
    function handleRawTextChange(changedText: string) {
        setRawText({rawText: changedText})
    }
    function handleCleanedTextChange(changedText: string) {
        setCleanedText({...cleanedText, cleanedText: changedText})
    }
    const rules =
        'Сервис удаляет из ников латинские буквы, спецсимволы, пробелы.<br/>' +
        'Если игрок поставил модификаторы правильно (W, D и.т.д.), они<br/>' +
        'не удалятся. В этом случае, вы должны удостоверится, что <br/>' +
        'модификаторы проставлены корректно. Вы сможете редактировать<br/>' +
        'очищенный список в окне справа.'
    return (
        <ContentTitle title='Очистка списка участников' controllable={true}>
            <div className='text-cleaner'>
                <div className='text-cleaner__raw'>
                    <p>Список для очистки:</p>
                    <TextAreaWritable height={300} handler={handleRawTextChange}/>
                    <ActionButton title={errMsg ? errMsg : 'Очистить текст'} show={true} action={handleClean} tooltip={rules} requiresLoading={true}/>
                    <p>Участников: {cleanedText.cleanedCount}</p>
                </div>
                <div className='text-cleaner__results'>
                    <div className='text-cleaner__results__cleaned'>
                        <p>Очищенный текст:</p>
                        <TextAreaWritable height={400} content={cleanedText.cleanedText} handler={handleCleanedTextChange}/>
                    </div>

                    {cleanedText.editedLines &&
                      <div className='text-cleaner__results__edited'>
                        <p>Измененные строки:</p><TextAreaReadOnly height={400} content={cleanedText.editedLines}/>
                    </div>}
                </div>
            </div>
        </ContentTitle>

    );
};

export default TextCleaner;