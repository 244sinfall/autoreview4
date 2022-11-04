import React from 'react';
import {Check} from "../../../../model/checks";
import {parseStringWithLinks} from "../../../../utils/parse-string-with-links";
import parse from 'html-react-parser';
import moment from "moment";


const CheckRow = (props: {check: Check, onClick: (check: Check) => any}) => {
    let mousePos: [number, number]
    const callbacks = {
        recordMousePos: (e: any) => mousePos = [e.clientX, e.clientY],
        compareMousePos: (e: any) => {
            if(mousePos[0] === e.clientX && mousePos[1] === e.clientY && e.target.tagName.toUpperCase() === "TD") {
                props.onClick(props.check)
            }
        }
    }
    return (
        <tr id={props.check.id + "-row"} className="table-row"
            onMouseDown={callbacks.recordMousePos}
            onMouseUp={callbacks.compareMousePos}>
            <td className="table-content" data-label="ID:">{props.check.id}</td>
            <td className="table-content" data-label="Дата и время:">{moment(props.check.date+"+03:00",
                "DD.MM.YYYY hh:mmZ").toDate().toLocaleString("ru", { dateStyle: "medium", timeStyle: "short" })}</td>
            <td className="table-content" data-label="Владелец:">{props.check.sender}</td>
            <td className="table-content" data-label="Тип:">{props.check.receiver}</td>
            <td className="table-content" data-label="Название:">{parse(parseStringWithLinks(props.check.subject))}</td>
            <td className="table-content" data-label="Описание:">{parse(parseStringWithLinks(props.check.body))}</td>
            <td className="table-content" data-label="Деньги:">{props.check.moneyString}</td>
            <td className="table-content" data-label="ГМ:">{props.check.gmName}</td>
            <td className="table-content" data-label="Статус:">{props.check.status}</td>
            <td className="table-content" data-label={props.check.items && "Вложения:"}>{props.check.itemsString}</td>
        </tr>
    );
};

export default React.memo(CheckRow);