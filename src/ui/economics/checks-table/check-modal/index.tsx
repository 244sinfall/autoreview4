import {ICheck} from "../../../../model/checks";
import ActionButton from "../../../../components/static/action-button";
import React from "react";
import ExecuteHelperOption from "./option";
import ModalTitle from "../../../../components/static/modal-title";
import './style.css'

function ExecuteHelper(props: {check: ICheck, closeHandler: () => void}) {
    const rejectCommand = `.check return ${props.check.id}`
    const openCommand = `.check open ${props.check.id}`
    const closeCommand = `.check close ${props.check.id}`
    return (
        <ModalTitle title="Макросы для чека" closeCallback={props.closeHandler}>
            <div className="CheckExecutor-content">
                {props.check.status === "Отказан" && <p>Этот чек отказан. Его невозможно изменить. Игроку необходимо отправить новый чек.</p>}
                {props.check.status === "Закрыт" && <ExecuteHelperOption title="Переоткрыть чек" command={openCommand}/>}
                {props.check.status === "Ожидает" &&
                  <div className="CheckExecutor-fields">
                    <ExecuteHelperOption title={"Закрыть чек"} command={closeCommand}/>
                    <ExecuteHelperOption title={"Отказать чек"} command={rejectCommand}/>
                  </div>
                }
                <ActionButton title={"Закрыть"} show={true} action={props.closeHandler} requiresLoading={false}/>
            </div>
        </ModalTitle>
    )
}

export default React.memo(ExecuteHelper)