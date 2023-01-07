import React, {useMemo} from "react";
import ModalTitle from "../../../../components/common/modal-title";
import CheckModalCopyOption from "./modal-field";
import {Check} from "../../../../model/economics/checks/check";
import './styles.css'

function CheckTableModal(props: {check: Check, closeHandler: () => void}) {
    const rejectCommand = `.check return ${props.check.check.id}`
    const openCommand = `.check open ${props.check.check.id}`
    const closeCommand = `.check close ${props.check.check.id}`
    let reforge = useMemo(() => {
        if(props.check.reforge() !== null) return props.check.reforge()
        return ""
    }, [props.check])
    return (
        <ModalTitle className="check-info-modal" title="Макросы для чека" closeCallback={props.closeHandler}>
            {props.check.check.status === "Отказан" && <p>Этот чек отказан. Его невозможно изменить. Игроку необходимо отправить новый чек.</p>}
            {props.check.check.status === "Закрыт" && <CheckModalCopyOption title="Переоткрыть чек" command={openCommand}/>}
            {props.check.check.status === "Ожидает" &&
              <>
                <CheckModalCopyOption title={"Закрыть чек"} command={closeCommand}/>
                <CheckModalCopyOption title={"Отказать чек"} command={rejectCommand}/>
              </>
            }
            {reforge && <CheckModalCopyOption title={"Перековка"} command={reforge}/>}
        </ModalTitle>
    )
}

export default React.memo(CheckTableModal)