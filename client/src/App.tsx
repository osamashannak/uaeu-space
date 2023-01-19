import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NavBar from "./components/NavBar";
import "./normalize.css";
import Home from "./pages/Home";
import Footer from "./components/Footer";

const App = () => {
    return (
        <BrowserRouter>
            <NavBar/>
            <Routes>
                <Route path={"/"} element={<Home/>}/>
            </Routes>
            <Footer/>
        </BrowserRouter>
    );
}

export default App;
