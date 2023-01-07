import React, {useCallback, useMemo} from 'react';
import ContentTitle from "../../common/content-title";
import ActionButton from "../../common/action-button";
import './styles.css'

type FileLogCleanerProps = {
    label: string
    onNewFile: (newFile: File) => void
    onTrigger: () => Promise<void>
    isTriggerDisabled: boolean
}

const FileLogCleaner = (props: FileLogCleanerProps) => {
    const rules = useMemo(() =>
        'Максимальный размер файла - 100 мегабайт.<br/><br/>' +
        'Очистка логов может занять до минуты в зависимости от скорости<br/>' +
        'вашего интернета. Если после очистки в файле все еще есть<br/>' +
        'нежелательные технические строки - обратитесь в ЛС', [])
    const callbacks = {
        onFileChange: useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            if(e.target.files && e.target.files.length === 1) {
                const possibleFile = e.target.files.item(0);
                if(possibleFile) props.onNewFile(possibleFile)
            }
        }, [props])
    }
    return (
        <ContentTitle className="log-cleaner" title='Очистка логов' collapsable={true}>
            <p className="log-cleaner__info">Загрузите файл с логами (txt) для очистки от технических сообщений</p>
            <div className="log-cleaner__drop-container">
                <label className="log-cleaner__drop-container-label" htmlFor="log">
                    {props.label}
                    <input className="log-cleaner__input"
                           id="log" type="file" name="uncleanedLog"
                           accept=".txt" onChange={callbacks.onFileChange}/>
                </label>
            </div>
            <span><ActionButton title='Очистить логи' onClick={props.onTrigger} tooltip={rules}
                                disabled={props.isTriggerDisabled}/></span>
        </ContentTitle>
    );
};

export default FileLogCleaner;