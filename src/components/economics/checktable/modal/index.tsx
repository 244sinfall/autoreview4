import React, {useMemo} from "react";
import ModalTitle from "../../../../components/common/modal-title";
import CheckModalCopyOption from "./modal-field";
import {Check} from "../../../../model/economics/checks/check";


function CheckTableModal(props: {check: Check, closeHandler: () => void}) {
    const rejectCommand = `.check return ${props.check.check.id}`
    const openCommand = `.check open ${props.check.check.id}`
    const closeCommand = `.check close ${props.check.check.id}`
    let reforge = useMemo(() => {
        if(props.check.reforge() !== null) return props.check.reforge()
        return ""
    }, [props.check])
    return (
        <ModalTitle title="Макросы для чека" closeCallback={props.closeHandler}>
            <div className="CheckExecutor-content">
                {props.check.check.status === "Отказан" && <p>Этот чек отказан. Его невозможно изменить. Игроку необходимо отправить новый чек.</p>}
                {props.check.check.status === "Закрыт" && <CheckModalCopyOption title="Переоткрыть чек" command={openCommand}/>}
                {props.check.check.status === "Ожидает" &&
                  <div className="CheckExecutor-fields">
                    <CheckModalCopyOption title={"Закрыть чек"} command={closeCommand}/>
                    <CheckModalCopyOption title={"Отказать чек"} command={rejectCommand}/>
                  </div>
                }
                {reforge && <CheckModalCopyOption title={"Перековка"} command={reforge}/>}
            </div>
        </ModalTitle>
    )
}

export default React.memo(CheckTableModal)