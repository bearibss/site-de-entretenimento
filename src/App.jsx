import { useState } from 'react'
import { Route, Routes } from "react-router-dom"
import './App.css'
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Inicio  from './pages/Inicio'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {


  return (
    <>
      <Routes>
        <Route path='/' element={<Inicio></Inicio>}></Route>
        <Route path='/cadastro' element={<Cadastro></Cadastro>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>
      </Routes>
    </>
  )
}

export default App
