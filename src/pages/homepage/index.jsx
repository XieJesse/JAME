import React from 'react'
import image from "../../assets/campus.png"
import Auth from "../auth/index"

const Homepage = () => {
  return (
    <div className='flex align-center justify-center py-12'>
       <div className='flex flex-row gap-14 pl-20'>
            <div>
                <img src={image} width="800" className='rounded-xl'/>
           </div>
           <div className='w-full'>
             <div className="flex flex-col gap-20">
                 <div>
                        <p className='text-8xl font-bold pt-4'>B-Scene</p>
                        <p className='text-2xl font-semibold text-neutral-600 w-2/3'>Innovatively visualize on-campus events, whenever you want.</p>
                 </div>
                   <div className=''>
                        <p>AI integration to filter through events catered towards you.</p>
                        <p>Set up and look through map pins to locate events at any time.</p>
                   </div>
             </div>
           </div>
       </div>
       <Auth force={true}/>
    </div>
  )
}

export default Homepage