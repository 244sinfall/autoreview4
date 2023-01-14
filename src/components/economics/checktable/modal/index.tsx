import React, {useMemo} from "react";
import ModalTitle from "../../../../components/common/modal-title";
import CheckModalCopyOption from "./modal-field";
import './styles.css'
import * as QualitiesObj from "../../../../model/economics/checks/qualities.json";
import {ICheck, ItemQuality, NextQualityOf} from "../../../../model/economics/checks/types";
import * as RandomItems from "../../../../model/economics/checks/randomItems.json";

function CheckTableModal(props: {check: ICheck, closeHandler: () => void}) {
    const rejectCommand = `.check return ${props.check.id}`
    const openCommand = `.check open ${props.check.id}`
    const closeCommand = `.check close ${props.check.id}`
    let reforge = useMemo(() => {
        if(!props.check.items) return null
        const qualified = props.check.items.filter(item => item.name in QualitiesObj)
        if(qualified.length === 0) return null
        const count = qualified.reduce((prev, curr) => curr.count + prev, 0)
        if(count !== 4) return null
        const qualitiesObject = QualitiesObj as {[key: string]: ItemQuality | undefined}
        const baseQuality = qualitiesObject[qualified[0].name]
        if(!baseQuality) return null
        if(qualified.every(item => QualitiesObj[item.name as keyof typeof QualitiesObj] === baseQuality)
            && NextQualityOf[baseQuality]) {
            const quality = NextQualityOf[baseQuality]!
            const items = RandomItems as Record<ItemQuality, {name: string, id: number}>
            return `.send it ${props.check.sender} "Перековка" "${items[quality].name}" ${items[quality].id}`
        }
        return null
    }, [props.check])
    return (
        <ModalTitle className="check-info-modal" title="Макросы для чека" closeCallback={props.closeHandler}>
            {props.check.status === "Отказан" && <p>Этот чек отказан. Его невозможно изменить. Игроку необходимо отправить новый чек.</p>}
            {props.check.status === "Закрыт" && <CheckModalCopyOption title="Переоткрыть чек" command={openCommand}/>}
            {props.check.status === "Ожидает" &&
              <>
                <CheckModalCopyOption title={"Закрыть чек"} command={closeCommand}/>
                <CheckModalCopyOption title={"Отказать чек"} command={rejectCommand}/>
                  {reforge && <CheckModalCopyOption title={"Перековка"} command={reforge}/>}
              </>
            }
        </ModalTitle>
    )
}

export default React.memo(CheckTableModal)