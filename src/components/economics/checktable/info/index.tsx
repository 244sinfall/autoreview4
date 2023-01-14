import React, {useMemo} from 'react';
import ActionButton from "../../../common/action-button";
import './styles.css'

type CheckTableInfoProps = {
    actualDate: string,
    checkCount: number
    filteredCheckCount: number
    isUserAbleToForceUpdate: boolean
    onForce: () => void
}

const CheckTableInfo = (props: CheckTableInfoProps) => {
    const cacheUpdateToolTip = useMemo(() =>
        'Обновление кэша подразумевает скачивание всех чеков с сайта Darkmoon.<br/>' +
        'Сервер проводит эту операцию каждые 30 минут. Обновление может занять<br/>' +
        'несколько минут (обычно, хватает 1-2 минут). Сервис будет недоступен<br/>' +
        'во время обновления. Запрашивать обновление можно не чаще раза в 5 минут<br/>' +
        'Обновлять кэш вручную могут только пользователи с группой доступа "ГМ"', [])
    return (
        <div className="check-table-info">
            <p>Данные актуальны на: {props.actualDate}</p>
            <p>Чеков в БД: {props.checkCount}. Чеков с учетом фильтра: {props.filteredCheckCount}</p>
            <span><ActionButton title={"Обновить кэш"}
                                onClick={props.onForce}
                                disabled={!props.isUserAbleToForceUpdate}
                                tooltip={cacheUpdateToolTip}/></span>
        </div>
    );
};

export default CheckTableInfo;