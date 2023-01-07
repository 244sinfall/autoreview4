import React from 'react';
import parse from 'html-react-parser';
import moment from "moment";
import {Check} from "../../../../../model/economics/checks/check";
import {parseStringWithLinks} from "../../../../../utils/parse-string-with-links";

const CheckRow = (props: {check: Check, onClick: (check: Check) => void}) => {
    let mousePos: [number, number]
    const callbacks = {
        recordMousePos: (e: React.MouseEvent<HTMLTableRowElement>) => mousePos = [e.clientX, e.clientY],
        compareMousePos: (e: React.MouseEvent<HTMLTableRowElement>) => {
            // if(mousePos[0] === e.clientX && mousePos[1] === e.clientY && e.target.tagName.toUpperCase() === "TD") {
            if(mousePos[0] === e.clientX && mousePos[1] === e.clientY) {
                props.onClick(props.check)
            }
        }
    }
    return (
        <tr id={props.check.check.id + "-row"} className="table-row"
            onMouseDown={callbacks.recordMousePos}
            onMouseUp={callbacks.compareMousePos}>
            <td className="table-content" data-label="ID:">{props.check.check.id}</td>
            <td className="table-content" data-label="Дата и время:">{moment(props.check.check.date+"+03:00",
                "DD.MM.YYYY hh:mmZ").toDate().toLocaleString("ru", { dateStyle: "medium", timeStyle: "short" })}</td>
            <td className="table-content" data-label="Владелец:">{props.check.check.sender}</td>
            <td className="table-content" data-label="Тип:">{props.check.check.receiver}</td>
            <td className="table-content" data-label="Название:">{parse(parseStringWithLinks(props.check.check.subject))}</td>
            <td className="table-content" data-label="Описание:">{parse(parseStringWithLinks(props.check.check.body))}</td>
            <td className="table-content" data-label="Деньги:">{props.check.moneyString}</td>
            <td className="table-content" data-label="ГМ:">{props.check.check.gmName}</td>
            <td className="table-content" data-label="Статус:">{props.check.check.status}</td>
            <td className="table-content" data-label={props.check.check.items && "Вложения:"}>{props.check.itemsString}</td>
        </tr>
    );
};

export default React.memo(CheckRow);