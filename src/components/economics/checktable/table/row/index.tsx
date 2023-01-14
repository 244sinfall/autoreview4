import React, {useMemo} from 'react';
import parse from 'html-react-parser';
import moment from "moment";
import {parseStringWithLinks} from "../../../../../utils/parse-string-with-links";
import useStrictClickHandler from "../../../../common/strict-click-handler";
import {ICheck} from "../../../../../model/economics/checks/types";

const CheckRow = (props: {check: ICheck, onClick: () => void}) => {
    const mouseCallbacks = useStrictClickHandler(props.onClick)
    const itemsString = useMemo(() => {
        if(!props.check.items) return ""
        const itemNames = props.check.items.map(item => item.name)
        const uniqueItems = [...new Set(itemNames)]
        const uniqueItemsWithAmount = uniqueItems.map(itemName => {
            let count = 0;
            props.check.items!.forEach((item) => {
                if(item.name === itemName) {
                    count += item.count
                }
            })
            return [itemName, count]
        })
        return uniqueItemsWithAmount.map(item => `[${item[0]}]x${item[1]}\n`)
    }, [props.check.items])
    
    const moneyString = useMemo(() => {
        if(isNaN(props.check.money) || props.check.money === 0) return "0 м."
        const money = {gold: 0, silver: 0, copper: 0}
        let moneyRemain = props.check.money
        if(moneyRemain > 10000) {
            money.gold = Math.floor(moneyRemain / 10000)
            moneyRemain = moneyRemain % 10000
        }
        if(moneyRemain > 100) {
            money.silver = Math.floor(moneyRemain / 100)
            moneyRemain = moneyRemain % 100
        }
        money.copper = moneyRemain
        let moneyStr = ""
        if(money.gold) moneyStr += `${money.gold} з. `
        if(money.silver) moneyStr += `${money.silver} с. `
        if(money.copper) moneyStr += `${money.copper} м.`
        return moneyStr
    }, [props.check.money])
    return (
        <tr id={props.check.id + "-row"} className="table-row"
            onMouseDown={mouseCallbacks.recordMousePos}
            onMouseUp={mouseCallbacks.compareMousePos}>
            <td className="table-content" data-label="ID:">{props.check.id}</td>
            <td className="table-content" data-label="Дата и время:">{moment(props.check.date+"+03:00",
                "DD.MM.YYYY hh:mmZ").toDate().toLocaleString("ru", { dateStyle: "medium", timeStyle: "short" })}</td>
            <td className="table-content" data-label="Владелец:">{props.check.sender}</td>
            <td className="table-content" data-label="Тип:">{props.check.receiver}</td>
            <td className="table-content" data-label="Название:">{parse(parseStringWithLinks(props.check.subject))}</td>
            <td className="table-content" data-label="Описание:">{parse(parseStringWithLinks(props.check.body))}</td>
            <td className="table-content" data-label="Деньги:">{moneyString}</td>
            <td className="table-content" data-label="ГМ:">{props.check.gmName}</td>
            <td className="table-content" data-label="Статус:">{props.check.status}</td>
            <td className="table-content" data-label={props.check.items && "Вложения:"}>{itemsString}</td>
        </tr>
    );
};

export default React.memo(CheckRow);