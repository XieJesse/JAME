import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import logo2 from '../assets/logo2.png'
import Auth from '../pages/auth/index'

const Layout = () => {
	return (
		<div>
			<div className="flex flex-row justify-between px-20 py-6 items-center justify-center">
				<div>
					{/* <p>logo</p> */}
					<Link className="text-red-500 py-2" to="/">
						<img src={logo2} alt="logo" width="100" />
					</Link>
				</div>
				<div>
					<ul className="flex flex-row items-center justify-center gap-20 ">
						<li className="text-sm font-bold text-slate-400 hover:text-black duration-300 transition decoration-2 underline-offset-4 hover:bg-neutral-100 rounded-2xl py-2 px-6 hover:drop-shadow-md">
							<Link to="/">Home</Link>
						</li>
						<li className="text-sm font-bold text-slate-400 hover:text-black duration-300 transition decoration-2 underline-offset-4 hover:bg-neutral-100 rounded-2xl py-2 px-6 hover:drop-shadow-md">
							<Link to="/map">Map</Link>
						</li>
						<li className="text-sm font-bold text-slate-400 hover:text-black duration-300 transition decoration-2 underline-offset-4 hover:bg-neutral-100 rounded-2xl py-2 px-6 hover:drop-shadow-md">
							<Link to="/about">About</Link>
						</li>
					</ul>
				</div>
				<div className="w-1/8">
					<Auth force={false} />
				</div>
			</div>
			<hr className="drop-shadow-md"></hr>
			<br></br>

			<Outlet />
		</div>
	)
}

export default Layout
