import React, {useRef} from 'react';
import ContentTitle from "../common/content-title";
import ActionButton from "../common/action-button";
import TextArea from "../common/text-area";
import './styles.css'

type ParticipantsCleanerProps = {
    error?: string,
    onSubmit: ((rawText: string) => Promise<void>) | ((rawText: string) => void)
    tooltip?: string,
    participantsCount?: number,
    result?: string
    editedLines?: string
}

const ParticipantsCleaner = (props: ParticipantsCleanerProps) => {
    const rawTextArea = useRef<HTMLTextAreaElement>(null)
    return (
        <ContentTitle className="text-cleaner"
                      title='Очистка списка участников'
                      collapsable={true}>
            <div className='text-cleaner__raw text-cleaner-block'>
                <p>Список для очистки:</p>
                <TextArea ref={rawTextArea} className="text-cleaner__raw-area text-cleaner-area"/>
                <ActionButton title={props.error ? props.error : 'Очистить текст'}
                              onClick={() => props.onSubmit(rawTextArea.current?.value ?? "")}
                              tooltip={props.tooltip}/>
                <p>Участников: {props.participantsCount ?? 0}</p>
                <p>Писатель отмечается только если отчет имеет <a href="https://rp-wow.ru/pages/fightsystem.html#%D0%9F%D0%BE%20%D1%81%D0%B2%D0%BE%D0%B5%D0%BC%D1%83%20%D0%B6%D0%B5%D0%BB%D0%B0%D0%BD%D0%B8%D1%8E:~:text=%D0%9F%D0%BE%20%D1%81%D0%B2%D0%BE%D0%B5%D0%BC%D1%83%20%D0%B6%D0%B5%D0%BB%D0%B0%D0%BD%D0%B8%D1%8E,%D1%8F%D0%B2%D0%BB%D1%8F%D0%B5%D1%82%D1%81%D1%8F%20%D0%BE%D0%B1%D1%8F%D0%B7%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%BC%20%D1%83%D1%81%D0%BB%D0%BE%D0%B2%D0%B8%D0%B5%D0%BC." target="_blank" style={{color: "blue"}} rel="noreferrer">
                    литературное описание.</a></p>
            </div>
            <div className='text-cleaner__result text-cleaner-block'>
                <p>Очищенный текст:</p>
                <TextArea className="text-cleaner__result-area text-cleaner-area"
                          defaultValue={props.result}/>
            </div>
            <div className='text-cleaner__result text-cleaner-block'>
              <p>Измененные строки:</p>
              <TextArea className="text-cleaner__result-area text-cleaner-area"
                        defaultValue={props.editedLines}/>
            </div>

        </ContentTitle>
    );
};

export default ParticipantsCleaner;