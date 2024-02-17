import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Outlet, BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Map from "./pages/map/index" 
import Layout from "./pages/Layout" 
import Homepage from "./pages/homepage/index"
import About from "./pages/about/index"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index={true} element={<Homepage />} />
          <Route path="/map" index={false} element={<Map />} />
          <Route path="/about" index={false} element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
