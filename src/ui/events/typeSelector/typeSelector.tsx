import React from 'react';
import ContentTitle from "../../../components/static/contentTitle/contentTitle";
import RadioButtonGroup from "../../../components/dynamic/radioButtonGroup/radioButtonGroup";
import {useAppDispatch, useAppSelector} from "../../../model/hooks";




const TypeSelector = () => {
    const dispatch = useAppDispatch();
    const state = useAppSelector((state) => state.event);

    return (
        <div>
            <ContentTitle title='Выбор конфигурации вердикта'>
                <RadioButtonGroup title='Выберите тип вердикта:' groupName={"Вид вердикта"} options={["Одобрено", "Отказано"]} handler={console.log}/>
                <RadioButtonGroup title='Выберите очередь вердикта:' groupName={"Очередь вердикта"} options={["Первичный", "Вторичный"]}/>
            </ContentTitle>
        </div>
    );
};

export default TypeSelector;