import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NavBar from "./components/NavBar";
import "./normalize.css";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Course from "./pages/Course";
import {useTranslation} from "react-i18next";
import Professor from "./pages/Professor";
import {ReactComponent as Loading} from "./assests/bubble-loading.svg";

const App = () => {
    const {t, i18n} = useTranslation();
    document.body.dir = i18n.dir();

    return (
        <BrowserRouter>
            <NavBar/>
            <React.Suspense fallback={<Loading/>}>
                <Routes>
                    <Route path={"/"} element={<Home/>}/>
                    <Route path={"/course/:tag"} element={<Course/>}/>
                    <Route path={"/professor/:email"} element={<Professor/>}/>

                </Routes> </React.Suspense>
            <Footer/>
        </BrowserRouter>
    );
}

export default App;
