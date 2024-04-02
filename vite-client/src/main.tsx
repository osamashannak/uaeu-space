import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.scss'
import {RouterProvider} from "react-router-dom";
import Router from "./router/default.tsx";
import {HelmetProvider} from "react-helmet-async";
import store from "./redux/store.ts";
import {Provider} from "react-redux";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <HelmetProvider>
                <RouterProvider router={Router}/>
            </HelmetProvider>
        </Provider>
    </React.StrictMode>,
)
