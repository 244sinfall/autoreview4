import {ICheck} from "../../../../model/checks";
import ContentTitle from "../../../../components/static/content-title";
import ActionButton from "../../../../components/static/action-button";
import React from "react";
import ExecuteHelperOption from "./option";

function ExecuteHelper(props: {check: ICheck, closeHandler: () => void}) {
    const rejectCommand = `.check return ${props.check.id}`
    const openCommand = `.check open ${props.check.id}`
    const closeCommand = `.check close ${props.check.id}`
    return (
        <div className="check-executor">
            <ContentTitle title={"Макросы для чека"} controllable={false}>
                {props.check.status === "Отказан" && <p>Этот чек отказан. Его невозможно изменить. Игроку необходимо отправить новый чек.</p>}
                {props.check.status === "Закрыт" && <ExecuteHelperOption title="Переоткрыть чек" command={openCommand}/>}
                {props.check.status === "Ожидает" &&
                  <div className="executor-fields">
                    <ExecuteHelperOption title={"Закрыть чек"} command={closeCommand}/>
                    <ExecuteHelperOption title={"Отказать чек"} command={rejectCommand}/>
                  </div>
                }
                <ActionButton title={"Закрыть"} show={true} action={props.closeHandler} requiresLoading={false}/>
            </ContentTitle>
        </div>
    )
}

export default React.memo(ExecuteHelper)