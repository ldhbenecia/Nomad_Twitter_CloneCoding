import React, { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";

function AppRouter() {

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <Router>
      <Routes>
        {isLoggedIn ?
        <>
        <Route path="/" element={<Home />} />
        </>
         : 
        <Route path="/" element={<Auth />} />
        }
      </Routes>
    </Router>
  )
}

export default AppRouter