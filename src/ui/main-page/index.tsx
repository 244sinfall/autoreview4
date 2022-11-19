import React from 'react';
import ContentTitle from "../../components/static/content-title";
import AccountManager from "../auth";
import LayoutGrid from "../../components/layouts/grid";

const MainPage = () => {
    return (
        <LayoutGrid templateColumns={"repeat(auto-fit, minmax(320px, auto))"}>
            <AccountManager/>
            <ContentTitle title={'Добро пожаловать'} controllable={false}>
                <p>Привет! Этот сайт предназначен для того, чтобы облегчить жизнь команде и игрокам Darkmoon.<br/><br/>
                Я занимаюсь этим проектом в свободное время, в учебных целях. Регистрация необходима только членам команды проекта,
                поскольку принадлежность к команде открывает дополнительные, полезные инструменты. В данный момент для игроков
                доступна очистка логов от технических сообщений и экономические чеки. Для использования сервиса, пользуйтесь меню
                в верхней части страницы (с телефона - слайдер сверху справа) Эта страница будет использоваться для публикации обновлений.<br/><br/>
                Если у вас есть пожелания по тому, что можно автоматизировать, замечания или найденные ошибки - пишите в дискорд rolevik dima#4300</p>
            </ContentTitle>
        </LayoutGrid>
    );
};

export default React.memo(MainPage);