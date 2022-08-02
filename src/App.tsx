import React from 'react';
import './App.css';
import Header from "./components/static/header/header";
import {Route, Routes} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./model/store";
import CharsheetPage from "./ui/charsheet/charsheetPage/charsheetPage";
import MainPage from "./ui/mainPage";
import EventsPage from "./ui/events/eventsPage/eventsPage";
import OtherPage from "./ui/other/otherPage/otherPage";
import ArbitersPage from "./ui/arbiters/arbitersPage/arbitersPage";


function App() {
  return (
    <Provider store={store}>
        <div className="App">
            <Header menuElements={[
                {
                    menuName: 'Анкеты',
                    menuRoute: '/charsheets'
                },
                {
                    menuName: 'Отчеты(WIP)',
                    menuRoute: '/events'
                },
                {
                    menuName: 'Арбитры(WIP)',
                    menuRoute: '/arbitration'
                },
                {
                    menuName: 'Экономика(WIP)',
                    menuRoute: '/economics'
                },
                {
                    menuName: 'Другое',
                    menuRoute: '/other'
                }


            ]}/>
            <Routes>
                <Route path='/charsheets' element={<CharsheetPage/>}/>
                <Route path='/events' element={<EventsPage/>}/>
                <Route path='/other' element={<OtherPage/>}/>
                <Route path='/arbitration' element={<ArbitersPage/>}/>
                <Route path='/' element={<MainPage/>}/>
            </Routes>

        </div>
    </Provider>
  );
}

export default App;
