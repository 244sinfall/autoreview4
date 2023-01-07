import React  from 'react';
import ContentTitle from "../common/content-title";
import './styles.css'
import Field from "../common/field";
import TextInput from "../common/text-input";
import ActionButton from "../common/action-button";

type ClaimedItemsWrapperProps = {
    children: React.ReactNode | React.ReactNode[]
    currentSearch: string,
    onSearch: (newSearch: string) => void
    onHTMLGenerate: () => Promise<void>
    canGenerateHTML: boolean
    error: string
}

const ClaimedItemsWrapper = (props: ClaimedItemsWrapperProps) => {
    return (
        <ContentTitle className="claimed-items-wrapper" title="Таблица именных предметов" collapsable={false}>
            <div className="claimed-items-options">
                <Field title="Поиск" containerOptions={{ direction: "column", justify: "center", gap: 10}}>
                    <TextInput value={props.currentSearch} onChange={props.onSearch} />
                </Field>
            </div>
            {props.error && <span className="claimed-items-error">{props.error}</span>}
            {props.children}
            <span className="claimed-items-html-button">
                <ActionButton title="Сгенерировать HTML" onClick={props.onHTMLGenerate} disabled={!props.canGenerateHTML}/>
            </span>
        </ContentTitle>
    );
};

export default React.memo(ClaimedItemsWrapper);