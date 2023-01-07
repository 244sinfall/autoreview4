import React, {useRef} from 'react';
import ContentTitle from "../common/content-title";
import ActionButton from "../common/action-button";
import TextArea from "../common/text-area";
import './styles.css'

type ParticipantsCleanerProps = {
    error?: string,
    onSubmit: ((rawText: string) => Promise<void>) | ((rawText: string) => void)
    tooltip?: string,
    participantsCount?: number
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