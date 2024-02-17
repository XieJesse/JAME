import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div>
        <div className=""> 
            <ul className="flex flex-row gap-10">
                <li>
                    <Link className="text-red-500" to="/">bscene</Link>
                </li>
                <li>
                    <Link to="/map">
                        map
                    </Link>
                </li>
                <li>
                    <Link to="/login">login</Link>
                </li>
            </ul>
        </div>

        <Outlet />

    </div>
  )
}

export default Layout