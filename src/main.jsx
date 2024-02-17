import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Outlet, BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Login from "./components/Login" 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Layout />}> */}
        <Route path="/" index={true} element={<App />} />
        <Route path="/login" index={false} element={<Login />} />



      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
