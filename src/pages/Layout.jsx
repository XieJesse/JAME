import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import logo2 from "../assets/logo2.png"
import Auth from "../pages/auth/index"

const Layout = () => {
  return (
    <div>
        <div className="flex flex-row justify-between px-20 py-4 items-center justify-center"> 
            <div>
                {/* <p>logo</p> */}
                <Link className="text-red-500 py-2" to="/">
                 <img src={logo2} alt="logo" width="100"/>
                </Link>
            </div>
            <div>
                <ul className="flex flex-row items-center justify-center gap-20">
                    <li className="text-sm font-bold text-slate-400 hover:text-black duration-300 transition hover:underline decoration-2 underline-offset-4">
                        <Link to="/">
                            Home
                        </Link>
                    </li>
                    <li className="text-sm font-bold text-slate-400 hover:text-black duration-300 transition hover:underline">
                        <Link to="/map">
                            Map
                        </Link>
                    </li>
                    <li className="text-sm font-bold text-slate-400 hover:text-black duration-300 transition hover:underline">
                        <Link to="/about">
                            About
                        </Link>
                    </li>
                </ul>
            </div>
            <div className='w-1/8'>
                <Auth force={false} />
            </div>
        </div>


        <Outlet />

    </div>
  )
}

export default Layout