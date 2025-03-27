import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Card from './Components/Card'
import './Assets/App.css'

const App = () => {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Card/>}/>
        </Routes>
    </div>
  )
}

export default App
