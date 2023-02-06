import React from 'react';
import useStrictClickHandler from "../../common/strict-click-handler";
import {GameObject, GameObjectTypeToName} from "../../../model/gob-searcher/types";

type GameObjectRowProps = {
    item: GameObject,
    onClick: (item: GameObject) => void
}
const GameObjectRow = (props: GameObjectRowProps) => {
    const mouseCallbacks = useStrictClickHandler(() => props.onClick(props.item))

    return (
        <tr id={props.item.id+"-row"} className="table-row"
            onMouseDown={mouseCallbacks.recordMousePos}
            onMouseUp={mouseCallbacks.compareMousePos}>
            <td className="table-content" data-label="ID:">{props.item.id}</td>
            <td className="table-content" data-label="Название:">{props.item.name}</td>
            <td className="table-content" data-label="Тип:">{GameObjectTypeToName[props.item.type]}</td>
        </tr>
    );
};

export default React.memo(GameObjectRow);