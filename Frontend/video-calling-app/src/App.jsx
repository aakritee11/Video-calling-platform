import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Landing from './pages/Landing.jsx'
import Authentication from './pages/Authentication.jsx'
import {Route, BrowserRouter, Routes } from 'react-router-dom'
import { AuthProvider } from './Context/AuthContext.jsx'
import VideoMeet from './pages/videoMeet.jsx'
import Home from './pages/Home.jsx'
import History from "./pages/history.jsx";

 function App() {
  

  return (
    <>
     
<BrowserRouter>
<AuthProvider>
<Routes>
  <Route path='/' element = {<Landing/>}/>
  <Route path='/auth' element={<Authentication/>}/>
  <Route path='/history' element={<History />} />
  <Route path='/:url' element={<VideoMeet/>}></Route>
  <Route path='/home' element={<Home/>}></Route>
</Routes>
</AuthProvider>
</BrowserRouter>

 </>
  )
}

export default App
