import React from 'react'
import image from "../../assets/watson.jpg"
import Auth from "../auth/index"

const Homepage = () => {
  return (
    <div className='flex align-center justify-center py-8'>
       <div className='flex flex-row gap-12 pl-20'>
            <div>
                <img src={image} className='rounded-xl absolute object-cover top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'/>
                <div className='text-8xl font-bold pt-5 absolute text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]' style={{shadow:"1px 1px 5px black"}}>B-Scene</div>
           </div>

       </div>
    </div>
  )
}

export default Homepage
