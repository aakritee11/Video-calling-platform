import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Landing from './pages/Landing.jsx'
import {Route, BrowserRouter, Routes } from 'react-router-dom'

 function App() {
  

  return (
    <>
     
<BrowserRouter>
<Routes>
  <Route path='/' element = {<Landing/>}/>
</Routes>
</BrowserRouter>

 </>
  )
}

export default App
