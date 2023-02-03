import React, { useEffect, useState, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import App from "./Pages/App"
import Connect from "./Pages/connect"



import "./App.css"


export const Userinfo = createContext()
export const Userinfos = () => useContext(Userinfo)

export const Newpoint = createContext()
export const Anewpoint = () => useContext(Newpoint)

export default function AppRouter() {


  return (
        <Router >
              <Routes  >
                <Route path="/" exact element={<App/>}></Route>
                <Route path="/connect" element={<Connect />}/>
                </Routes>

      </Router>

  )

}


