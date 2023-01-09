import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import ServicesProviderContext from "./services/context";
import ServicesProvider from "./services";

const services = new ServicesProvider()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <ServicesProviderContext services={services}>
      <BrowserRouter>
          <Provider store={services.get("Store").get()}>
              <App />
          </Provider>
      </BrowserRouter>
    </ServicesProviderContext>
);

