import React from "react"
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import CreateGoal from './pages/CreateGoal.jsx'
import ShowGoal from './pages/ShowGoal.jsx'
import EditGoal from './pages/EditGoal.jsx'
import DeleteGoal from './pages/DeleteGoal.jsx'


const App = () => {
  return (
    <Routes>
      <Route path= '/' element={<Home />} />
      <Route path= '/goals/create' element={<CreateGoal />} />
      <Route path= '/goals/details/:id' element={<ShowGoal />} />
      <Route path= '/goals/edit/:id' element={<EditGoal />} />
      <Route path= '/goals/delete/:id' element={<DeleteGoal />} />
      
    </Routes>
  )
};

export default App;