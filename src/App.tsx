import React from 'react';
import './App.css';
import Header from "./components/static/header";
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


function App() {
  return (
    <Provider store={store}>
        <div className="App">
            <Header menuElements={[{menuName: 'Анкеты',  menuRoute: '/charsheets', accessLevel: 1},
                {menuName: 'Отчеты', menuRoute: '/events', accessLevel: 1},
                {menuName: 'Арбитры', menuRoute: '/arbitration', accessLevel: 1},
                {menuName: 'Экономика', menuRoute: '/economics', accessLevel: 0},
                {menuName: 'Другое', menuRoute: '/other', accessLevel: 0}
            ]}/>
            <Routes>
                <Route path='/charsheets' element={<CharsheetPage/>}/>
                <Route path='/events' element={<EventsPage/>}/>
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

export default App;
