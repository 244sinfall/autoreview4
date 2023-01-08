import React from 'react';
import parse from 'html-react-parser';
import {parseStringWithLinks} from "../../../utils/parse-string-with-links";
import {ClaimedItemInterface} from "../../../model/claimed-items/types";
import apiStringDateToString from "../../../utils/api-string-date-to-string";
import useStrictClickHandler from "../../common/strict-click-handler";

type ClaimedItemRowProps = {
    item: ClaimedItemInterface,
    onClick: (item: ClaimedItemInterface) => void
}
const ClaimedItemRow = (props: ClaimedItemRowProps) => {
    const mouseCallbacks = useStrictClickHandler(() => props.onClick(props.item))
    const itemNameWithLink = `<a class='generated-link' href="${props.item.link}" target='_blank' rel='norefferer'>${props.item.name}</a>`

    const ownerNameWithLink = `<a class='generated-link' href="${props.item.ownerProfile}" target='_blank' rel='norefferer'>${props.item.owner}</a>`

    return (
        <tr id={props.item.id+"-row"} className="table-row"
            onMouseDown={mouseCallbacks.recordMousePos}
            onMouseUp={mouseCallbacks.compareMousePos}>
            <td className="table-content" data-label="Название:">{parse(itemNameWithLink)}</td>
            <td className="table-content" data-label="Владелец:">{parse(ownerNameWithLink)}</td>
            <td className="table-content" data-label="Доказательство владения:">{parse(parseStringWithLinks(props.item.ownerProofLink))}</td>
            <td className="table-content" data-label="Согласовавший:">{props.item.reviewer}</td>
            <td className="table-content" data-label={"Дата добавления:"}>
                {apiStringDateToString(props.item.addedAt)}</td>
            <td className="table-content" data-label={"Утвердивший:"}>{props.item.accepted ? props.item.acceptor : ""}</td>
            <td className="table-content" data-label={"Дата утверждения:"}>
                {props.item.accepted ? apiStringDateToString(props.item.acceptedAt) : ""}</td>
            <td className="table-content" data-label="Доп. инфо:">{props.item.additionalInfo}</td>
        </tr>
    );
};

export default React.memo(ClaimedItemRow);