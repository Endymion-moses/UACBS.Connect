//import React from 'react'
import {assets} from '../assets/assets'

const Navbar = () => {
  return (
    
    <div className='flex ml-auto gap-5 items-center'>
        <div className='relative cursor-pointer'>
          <img src={assets.notification_icon} alt="notifications" className='h-6 w-6'/>
          <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold 
          rounded-full h-5 w-5 flex items-center justify-center'>2</span>
        </div>
        <button className='border border-blue-900 rounded-full
         w-8 h-8 bg-blue-900 text-white font-semibold hover:bg-blue-800'>AD</button>
    </div>
    
  )
}

export default Navbar