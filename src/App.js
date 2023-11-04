import React from 'react'
import { BrowserRouter , Routes, Route } from "react-router-dom";

import Register from './pages/Register'
import Login from './pages/Login'
import "./style.scss"
import Home from './pages/Home'
import { useContext } from 'react';
import { AuthContext } from './Context/AuthContext';
import Call from './components/Call';
function App() {
    // const
  const { currentUser } = useContext(AuthContext);
  // console.log(currentUser)
  return (
    <BrowserRouter>
      <Routes>

    <Route path="/">
      <Route index element = { currentUser?<Home/>:<Login/>}/>

      <Route path='register' element = {<Register/>}/>
      <Route path="login" element = {<Login/>}/>
      <Route path="call" element = {<Call/>}/>

      </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
