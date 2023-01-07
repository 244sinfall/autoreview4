import React, {useState} from "react";
import Field from "../../../../common/field";
import TextInput from "../../../../common/text-input";
import ActionButton from "../../../../common/action-button";

function CheckModalCopyOption(props: {title: string, command: string}) {

    const [copied, setCopied] = useState(false)

    return (
        <div className="CheckExecutor-field">
            <Field title={props.title}>
                <TextInput maxLength={128} defaultValue={props.command}/>
            </Field>
            <ActionButton title={copied ? "Скопировано" : "Скопировать команду"} onClick={async() => {
                await navigator.clipboard.writeText(props.command)
                setCopied(true)
                return setTimeout(() => setCopied(false), 1000)
            }}/>
        </div>
    )

}

export default React.memo(CheckModalCopyOption)