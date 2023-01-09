import React, {useEffect, useMemo, useState} from 'react';
import './App.css';
import Header from "./ui/header";
import {Route, Routes} from "react-router-dom";
import CharsheetPage from "./ui/charsheet/charsheet-page";
import MainPage from "./ui/main-page";
import EventsPage from "./ui/events/events-page";
import OtherPage from "./ui/other/other-page";
import ArbitersPage from "./ui/arbiters/arbiters-page";
import AdminPage from "./ui/admin/admin-page";
import EconomicsPage from "./ui/economics/economics-page";
import ClaimedItemsPage from "./ui/claimed-items";
import {PERMISSION} from "./model/user";
import {Types} from "./model/header/types";
import {useAppDispatch, useAppSelector} from "./services/services/store";
import {changeTheme} from "./model/theme";
import {Theme} from "./model/theme/types";



function App() {
    const dispatch = useAppDispatch()
    const currentTheme = useAppSelector(state => state.theme.selected);
    const defaultMenuElements = useMemo(() => {
        const switchTheme = (theme: Theme) => {
            dispatch(changeTheme(theme));
            setMenuElements(defaultMenuElements);
        }
        return [
            {menuName: 'Анкеты',  menuRoute: '/charsheets', accessLevel: PERMISSION.Reviewer},
            {menuName: 'Отчеты', menuRoute: '/events', accessLevel: PERMISSION.Reviewer},
            {menuName: "Таблица именных предметов", menuRoute: '/claimed_items'},
            {menuName: 'Арбитры', menuRoute: '/arbitration', accessLevel: PERMISSION.Arbiter},
            {menuName: 'Экономика', menuRoute: '/economics'},
            {menuName: 'Другое', menuRoute: '/other'},
            {menuName: 'Тема', action: () => setMenuElements(
                    [{menuName: "Darkmoon", action: () => switchTheme("darkmoon")},
                        {menuName: "Светлая", action: () => switchTheme("light")},
                        {menuName: "Темная", action: () => switchTheme("dark")},
                        {menuName: "Назад", action: () => setMenuElements(defaultMenuElements)}])}]
    }, [dispatch])
    const [menuElements, setMenuElements] = useState<Types[]>(defaultMenuElements)
    useEffect(() => {
        document.body.className = '';
        document.body.classList.add(currentTheme);
        const color = window.getComputedStyle(document.body).getPropertyValue("--accent-background")
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
    }, [currentTheme])

  return (

        <div className="App">
            <Header menuElements={menuElements}/>
            <Routes>
                <Route path='/charsheets' element={<CharsheetPage/>}/>
                <Route path='/events' element={<EventsPage/>}/>
                <Route path='/claimed_items' element={<ClaimedItemsPage/>}/>
                <Route path='/other' element={<OtherPage/>}/>
                <Route path='/arbitration' element={<ArbitersPage/>}/>
                <Route path='/economics' element={<EconomicsPage/>}/>
                <Route path='/admin' element={<AdminPage/>}/>
                <Route path='/' element={<MainPage/>}/>
            </Routes>
        </div>
  );
}

export default React.memo(App);
