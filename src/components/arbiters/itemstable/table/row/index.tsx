import React from 'react';
import {ArbiterItemInfo} from "../../../../../model/arbiters/items/types";

const ArbiterItemRow = (props: {item: ArbiterItemInfo}) => {
    return (
        <tr id={props.item.id + "-row"} className="table-row">
            <td className="table-content" data-label="ID:">{props.item.id}</td>
            <td className="table-content" data-label="Название:">{props.item.name}</td>
            <td className="table-content" data-label="Качество:">{props.item.quality}</td>
            <td className="table-content" data-label="Статы:">{props.item.description}</td>
        </tr>
    );
};

export default React.memo(ArbiterItemRow);