import React from "react"
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ShowGoal from './pages/ShowGoal.jsx'


const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/goals/details/:id' element={<ShowGoal />} />
    </Routes>
  )
};

export default App;