import React, {useState} from "react";
import Field from "../../../../common/field";
import TextInput from "../../../../common/text-input";
import ActionButton from "../../../../common/action-button";
import './styles.css'

function CheckModalCopyOption(props: {title: string, command: string}) {

    const [copied, setCopied] = useState(false)

    return (
        <div className="check-info-modal-field">
            <Field title={props.title}>
                <TextInput maxLength={128} defaultValue={props.command}/>
            </Field>
            <span className="check-info-modal-field-button"><ActionButton title={copied ? "Скопировано" : "Скопировать команду"} onClick={async() => {
                await navigator.clipboard.writeText(props.command)
                setCopied(true)
                return setTimeout(() => setCopied(false), 1000)
            }}/></span>
        </div>
    )

}

export default React.memo(CheckModalCopyOption)