import Visitor, {PERMISSION} from "../../../model/auth/user";
import React, {useState} from "react";
import ActionButton from "../../../components/common/static/action-button";
import {getClaimedItemsTitle} from "../../../model/claimed-items";

const ClaimedItemCategory = (props:{t: JSX.Element, user: Visitor, addButtonHandler: (quality: string) => void}) => {
    const [isShowing, setIsShowing] = useState(true)
    return (
        <>
            <div key={props.t.key+"div"} className="claimed-items__category">
                <div className="claimed-items__header">
                    <ActionButton title="Добавить предмет" show={props.user ? props.user.canAccess(PERMISSION.Reviewer) : false} action={() => props.addButtonHandler(props.t.key as string)} requiresLoading={false}/>
                    <p key={props.t.key+"p"}>{getClaimedItemsTitle(props.t.key as string)}</p>
                    <ActionButton title={isShowing ? "Скрыть категорию" : "Показать категорию"} show={true} action={() => setIsShowing(!isShowing)} requiresLoading={false}/>
                </div>
                <div className="table-wrapper" style={{display: isShowing ? "block": "none"}}>
                    {props.t}
                </div>
            </div>
            <hr/>
        </>
    )
}

export default React.memo(ClaimedItemCategory)