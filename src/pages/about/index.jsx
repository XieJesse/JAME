import React from 'react'
import image from "../../assets/campus.png"

const About = () => {
  return (
    <div className='flex align-center justify-center py-8'>
       <div className='flex flex-row gap-12 pl-20'>
            <div>
                <img src={image} width="1000" className='rounded-xl'/>
           </div>
           <div className='w-full'>
             <div className="flex flex-col gap-6">
                 <div>
                        <p className='text-8xl font-bold pt-4 pb-4'>About the Project</p>
                        <p className='text-2xl font-semibold text-neutral-500 w-11/12 pb-10 text-center'>Innovatively visualize on-campus events, whenever you want.</p>
                        <hr class="h-px bg-gray-200 border-1 dark:bg-gray-700 w-11/12"/>
                 </div>
                   <div className='flex flex-col gap-4 pr-4'>
                        <div class="grid grid-cols-2 gap-4 pr-4 text-xl text-center">
                          <div>
                            <h1 className="font-bold py-2"> FOR PROFESSIONAL/SOCIAL OCCASIONS </h1>
                            <p> Our application allows users to schedule or host events by adding pins onto a map. </p>
                          </div>
                          <div>
                            <h1 className="font-bold py-2"> FOR EASE AND ACCESSIBILITY </h1>
                            <p> The map is interactable, allowing users to find locations and data about those events. </p>
                          </div>
                          <div>
                            <h1 className="font-bold py-2"> FOR FINDING THE BEST EVENTS </h1>
                            <p> Existing filters can be applied to screen events according to selected tags, or favorited events. </p>
                          </div>
                          <div>
                            <h1 className="font-bold py-2"> FOR QUALITY RECOMMENDATIONS </h1>
                              <p> Our application also integrates OpenAI to recommend events catered to prompts! </p>
                          </div>

                        </div>
                   </div>
                   <div>
                      <p class="text-3xl text-center py-2"> We hope that Binghamton students and clubs can use our application to make hosting and starting events easier! </p>
                  </div>
             </div>
           </div>
       </div>
    </div>
  )
}

export default About
