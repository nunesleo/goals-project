import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ShowGoal from './pages/ShowGoal.jsx';
import Login from "./pages/Login.jsx";
import Menu from "./components/Menu.jsx";
import Analysis from "./pages/Analysis.jsx";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <>
      <Menu setToken={setToken} />
      <Routes>
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route
          path="/goals/details/:id"
          element={token ? <ShowGoal /> : <Navigate to="/login" />}
        />
        <Route path="/analysis" element={token ? <Analysis /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
};


export default App;