import React from 'react';
import './App.css';
import Header from "./components/static/header/header";
import {Route, Routes} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./model/store";
import CharsheetPage from "./ui/charsheet/charsheetPage/charsheetPage";

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
                }


            ]}/>
            <Routes>
                <Route path='/charsheets' element={<CharsheetPage/>}/>
                <Route path='/' element={<div></div>}/>
            </Routes>

        </div>
    </Provider>
  );
}

export default App;
