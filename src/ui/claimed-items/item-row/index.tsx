import React from 'react';
import parse from 'html-react-parser';
import {ClaimedItem} from "../../../model/claimed-items";
import {parseStringWithLinks} from "../../../utils/parse-string-with-links";

const ItemRow = (props: {item: ClaimedItem, onClick: (item: ClaimedItem) => any}) => {
    let mousePos: [number, number]
    const callbacks = {
        recordMousePos: (e: any) => mousePos = [e.clientX, e.clientY],
        compareMousePos: (e: any) => {
            if(mousePos[0] === e.clientX && mousePos[1] === e.clientY && e.target.tagName.toUpperCase() === "TD") {
                props.onClick(props.item)
            }
        }
    }
    const itemNameWithLink = `<a class='generated-link' href="${props.item.link}" target='_blank' rel='norefferer'>${props.item.name}</a>`

    const ownerNameWithLink = `<a class='generated-link' href="${props.item.ownerProfile}" target='_blank' rel='norefferer'>${props.item.owner}</a>`

    return (
        <tr id={props.item.id+"-row"} className="table-row"
            onMouseDown={callbacks.recordMousePos}
            onMouseUp={callbacks.compareMousePos}>
            <td className="table-content" data-label="Название:">{parse(itemNameWithLink)}</td>
            <td className="table-content" data-label="Владелец:">{parse(ownerNameWithLink)}</td>
            <td className="table-content" data-label="Доказательство владения:">{parse(parseStringWithLinks(props.item.ownerProofLink))}</td>
            <td className="table-content" data-label="Согласовавший:">{props.item.reviewer}</td>
            <td className="table-content" data-label={props.item.addedAt && "Дата добавления:"}>
                {props.item.addedAt && props.item.addedAt.toLocaleString()}</td>
            <td className="table-content" data-label="Утвердивший:">{props.item.acceptor}</td>
            <td className="table-content" data-label={props.item.accepted && "Дата утверждения:"}>
                {props.item.accepted && props.item.acceptedAt.toLocaleString()}</td>
            <td className="table-content" data-label="Доп. инфо:">{props.item.additionalInfo}</td>
        </tr>
    );
};

export default React.memo(ItemRow);