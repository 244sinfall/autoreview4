import React, {useCallback, useMemo, useState} from 'react';

import {
    cleanParticipantsText,
    ParticipantsCleanerResponse
} from "../../../model/common/participants-cleaner";
import ParticipantsCleaner from "../../../components/participants-cleaner";

const TextCleaner = () => {
    const [cleanedText, setCleanedText] = useState<ParticipantsCleanerResponse>({cleanedText: "", editedLines: "", cleanedCount: 0})
    const [errMsg, setErrMsg] = useState("")

    const callbacks = {
        onSubmit: useCallback(async(rawText: string) => {
            try {
                const result = await cleanParticipantsText(rawText);
                return setCleanedText(result);
            } catch (e: unknown) {
                if(e instanceof Error) {
                    setErrMsg(e.message)
                    setTimeout(() => setErrMsg(""), 1500)
                }
            }
        }, [])
    }

    const rules = useMemo(() =>
        'Сервис удаляет из ников латинские буквы, спецсимволы, пробелы.<br/>' +
        'Если игрок поставил модификаторы правильно (W, D и.т.д.), они<br/>' +
        'не удалятся. В этом случае, вы должны удостоверится, что <br/>' +
        'модификаторы проставлены корректно. Вы сможете редактировать<br/>' +
        'очищенный список в окне справа.',
        [])

    return (
        <ParticipantsCleaner onSubmit={callbacks.onSubmit}
                             editedLines={cleanedText.editedLines}
                             tooltip={rules}
                             error={errMsg}
                             result={cleanedText.cleanedText}/>
    );
};

export default TextCleaner;