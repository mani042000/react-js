import React from 'react'
import { Route, Routes } from 'react-router-dom'
import WeatherCard from './Components/Card'

const App = () => {
  return (
    <div>
        <Routes>
            <Route path='/' element={<WeatherCard/>}/>
        </Routes>
    </div>
  )
}

export default App
