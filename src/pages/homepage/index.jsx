import React from 'react'
import image from "../../assets/campus.png"
import Auth from "../auth/index"

const Homepage = () => {
  return (
    <div className='flex align-center justify-center py-8'>
       <div className='flex flex-row gap-12 pl-20'>
            <div>
                <img src={image} width="800" className='rounded-xl'/>
           </div>
           <div className='w-full'>
             <div className="flex flex-col gap-6">
                 <div>
                        <p className='text-8xl font-bold pt-4'>B-Scene</p>
                        <p className='text-2xl font-semibold text-neutral-500 w-2/3'>Innovatively visualize on-campus events, whenever you want.</p>
                 </div>
                   <div className='flex flex-col gap-4'>
                        <div className="w-2/3 px-4 py-8 text-neutral-500 rounded-xl border border-2 bg-neutral-100">
                            <p>AI integration to filter through events catered towards you.</p>
                        </div>
                        <div className="w-2/3 px-4 py-8 text-neutral-500 rounded-xl border border-2 bg-neutral-100">
                            <p>Set up map pins to locate events at any time.</p>
                        </div>
                   </div>
                   <div className='w-1/5'> <Auth force={true} /></div>

             </div>
           </div>
       </div>
    </div>
  )
}

export default Homepage