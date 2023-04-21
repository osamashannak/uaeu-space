import React from 'react';
import NavBar from "./components/NavBar";
import "./normalize.css";
import Footer from "./components/Footer";
import {useTranslation} from "react-i18next";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Course from "./pages/Course";
import Professor from "./pages/Professor";
import NotFound from "./pages/NotFound";
import LoadingScreen from "./components/LoadingScreen";
import {Helmet} from "react-helmet";
import Sitemap from "./pages/Sitemap";

const App = () => {
    const {t, i18n} = useTranslation();
    document.body.dir = i18n.dir();

    return (
        <BrowserRouter>
            <Helmet
                titleTemplate="%s - UAEU Space"
                defaultTitle="UAEU Space"
            >
                <meta name="description"
                      content="UAEU Space is a multi-purpose platform for UAEU students to prepare them during their studies. You can find and share materials for courses that are taken by the university's students."/>
            </Helmet>
            <React.Suspense fallback={<LoadingScreen/>}>
                <NavBar/>
                <Routes>
                    <Route path={"/"} element={<Home/>}/>
                    <Route path={"/course"} element={<Course/>}/>
                    <Route path={"/course/:tag"} element={<Course/>}/>
                    <Route path={"/professor"} element={<Professor/>}/>
                    <Route path={"/professor/:email"} element={<Professor/>}/>
                    <Route path={"/sitemap"} element={<Sitemap/>}/>
                    <Route path={"/*"} element={<NotFound/>}/>
                </Routes>
                <Footer/>
            </React.Suspense>
        </BrowserRouter>
    );
}

export default App;
