import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {initTheme} from "./themes";

initTheme()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
      <BrowserRouter>
         <App />
      </BrowserRouter>
);

