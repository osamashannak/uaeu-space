import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './index.css';
import Home from "./components/Home";
import Course from "./components/Course";
import Professor from "./components/Professor";
import underline from "./assests/underline.svg";
import spiralArrow from "./assests/fun-arrow.svg";
import About from "./components/About";


const App = () => {
    return (
        <><>
            <div id="nav-bar">
                <div id="titleBox">
                    <a id="title" href="/home" className="head unselectable align">UAEU Resources. 📚</a>
                    <img id="spiral-arrow-img" className="unselectable" draggable={false} src={spiralArrow.toString()}
                         alt="spiral-arrow"/>
                </div>
                <div id="navBox">
                    <ul id="nav" className="head">
                        <li className="navl unselectable"><a href="about">What is this site?</a></li>
                        <li className="navl unselectable"><a href="TODO">عربي</a></li>
                    </ul>
                    <img id="underline-img" className="unselectable" draggable={false} src={underline.toString()}
                         alt="underline"/>
                </div>

            </div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/course" element={<Course/>}/>
                    <Route path="/professor" element={<Professor/>}/>
                    <Route path="/about" element={<About/>}/>
                </Routes>
            </BrowserRouter></>
            <div id="footer">
                <p>Copyright © 2023. Illustrations courtesy of <u><a target="_blank" rel="noreferrer"
                                                                     href="https://undraw.co">Undraw</a></u>.</p>
                <a href="/contact">Contact me</a>
            </div>
        </>
    );
}

export default App;
