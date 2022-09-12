import React from 'react';
import ContentTitle from "../../components/static/content-title";
import './style.css'
import AccountManager from "../auth";

const MainPage = () => {
    return (
        <div className={"main-page"}>
            <AccountManager/>
            <ContentTitle title={'Запуск сайта на React'}>
                <p style={{textAlign: "center"}}>Привет! Этот сайт предназначен для того, чтобы облегчить жизнь команде Darkmoon.<br/>
                В большей степени он предназначен для моего обучения веб-разработке и другим сетевым штукам.<br/>
                Реализуется все это дело на React, а API построено на Golang.
                Для использования сервиса пользуйтесь меню наверху.<br/> Эта страница нужна для публикации обновлений.
                Если у вас есть пожелания по тому, что можно автоматизировать - пишите в дискорд rolevik dima#4300</p>
            </ContentTitle>
        </div>
    );
};

export default MainPage;