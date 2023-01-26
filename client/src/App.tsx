import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NavBar from "./components/NavBar";
import "./normalize.css";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Course from "./pages/Course";
import {useTranslation} from "react-i18next";
import ErrorPage from "./error-page.";
import Professor from "./pages/Professor";
import Rate from "./pages/Rate";

const App = () => {
    const {t, i18n} = useTranslation();
    document.body.dir = i18n.dir();

    return (
        <BrowserRouter>
            <NavBar/>
            <Routes>
                <Route errorElement={<ErrorPage/>} path={"/"} element={<Home/>}/>
                <Route path={"/course/:tag"} element={<Course/>}/>
                <Route path={"/professor/:email"} element={<Professor/>}/>
                <Route path={"/professor/:email/rate"} element={<Rate/>}/>
            </Routes>
            <Footer/>
        </BrowserRouter>
    );
}

export default App;