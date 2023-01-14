import React from 'react';
import {Route, Routes, BrowserRouter} from 'react-router-dom';
import './index.css';
import Home from "./components/home";
import Course from "./components/course";
import Professor from "./components/professor";


function App() {
  return (
      <>
              <p id="title" className="head unselectable align">UAEU Resources. 📚</p>
              <ul id="nav" className="head">
                  <li className="navl unselectable"><a href="TODO">عربي</a></li>
              <li className="navl unselectable"><a href="about">What is this site?</a></li>
          </ul>
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<Home/>}/>
                  <Route path="/home" element={<Home/>}/>
                  <Route path="/course" element={<Course/>}/>
                  <Route path="/professor" element={<Professor/>}/>
              </Routes>
          </BrowserRouter></>
  );
}

export default App;
