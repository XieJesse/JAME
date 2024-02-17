import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Outlet, BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Auth from "./pages/auth/index" 
import Map from "./pages/map/index" 
import Layout from "./pages/Layout" 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index={true} element={<App />} />
          <Route path="/login" index={false} element={<Auth />} />
          <Route path="/map" index={false} element={<Map />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
