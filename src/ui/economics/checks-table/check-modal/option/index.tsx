import React, {useState} from "react";
import TextInput from "../../../../../components/common/dynamic/text-input";
import ActionButton from "../../../../../components/common/static/action-button";
import '../style.css'

function ExecuteHelperOption(props: {title: string, command: string}) {
    const [copied, setCopied] = useState(false)
    return (<div className="CheckExecutor-field">
        <TextInput title={props.title} placeholder={""} maxLength={128} defaultValue={props.command}/>
        <ActionButton title={copied ? "Скопировано" : "Скопировать команду"} show={true} action={() => {
            navigator.clipboard.writeText(props.command).then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 1000)
            })
        }} requiresLoading={false}/>
    </div>)
}

export default React.memo(ExecuteHelperOption)