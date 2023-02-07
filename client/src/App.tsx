import React from 'react';
import NavBar from "./components/NavBar";
import "./normalize.css";
import Footer from "./components/Footer";
import {useTranslation} from "react-i18next";
import {ReactComponent as Loading} from "./assests/bubble-loading.svg";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Course from "./pages/Course";
import Professor from "./pages/Professor";
import NotFound from "./pages/NotFound";

const App = () => {
    const {t, i18n} = useTranslation();
    document.body.dir = i18n.dir();

    return (
        <BrowserRouter>
            <NavBar/>
            <React.Suspense fallback={<Loading/>}>
                <Routes>
                    <Route path={"/"} element={<Home/>}/>
                    <Route path={"/course"} element={<Course/>}/>
                    <Route path={"/course/:tag"} element={<Course/>}/>
                    <Route path={"/professor"} element={<Professor/>}/>
                    <Route path={"/professor/:email"} element={<Professor/>}/>
                    <Route path={"/*"} element={<NotFound/>}/>
                </Routes>
            </React.Suspense>
            <Footer/>
        </BrowserRouter>
    );
}

export default App;
