import React, {useState} from 'react';
import './App.css';
import Header from "./ui/header";
import {Route, Routes} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./model/store";
import CharsheetPage from "./ui/charsheet/charsheet-page";
import MainPage from "./ui/main-page";
import EventsPage from "./ui/events/events-page";
import OtherPage from "./ui/other/otherPage/otherPage";
import ArbitersPage from "./ui/arbiters/arbiters-page";
import AdminPage from "./ui/admin/admin-page";
import EconomicsPage from "./ui/economics/economics-page";
import ClaimedItemsPage from "./ui/claimed-items";
import {Permission} from "./model/auth/user";
import {HeaderMenuElement} from "./model/header-menu-element";
import {createThemes} from "./themes";



function App() {
    const defaultMenuElements = [
        {menuName: 'Анкеты',  menuRoute: '/charsheets', accessLevel: Permission.reviewer},
        {menuName: 'Отчеты', menuRoute: '/events', accessLevel: Permission.reviewer},
        {menuName: "Таблица именных предметов", menuRoute: '/claimed_items', accessLevel: Permission.player},
        {menuName: 'Арбитры', menuRoute: '/arbitration', accessLevel: Permission.arbiter},
        {menuName: 'Экономика', menuRoute: '/economics', accessLevel: Permission.player},
        {menuName: 'Другое', menuRoute: '/other', accessLevel: Permission.player},
        {menuName: 'Тема', accessLevel: Permission.player, action: () => setMenuElements(createThemes(() => setMenuElements(defaultMenuElements))) }
    ]
    const [menuElements, setMenuElements] = useState<HeaderMenuElement[]>(defaultMenuElements)
  return (
    <Provider store={store}>
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
    </Provider>
  );
}

export default React.memo(App);
