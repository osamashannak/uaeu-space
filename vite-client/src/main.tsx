import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.scss'
import {RouterProvider} from "react-router-dom";
import Router from "./router/default.tsx";
import {HelmetProvider} from "react-helmet-async";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <HelmetProvider>
            <RouterProvider router={Router}/>
        </HelmetProvider>
    </React.StrictMode>,
)
