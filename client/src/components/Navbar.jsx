//import React from 'react'
import { useState, useEffect } from "react";
import {assets} from '../assets/assets'

const Navbar = () => {
   const [user, setUser] = useState(null);

   useEffect(() => {
    // Read the active session data we saved during the login phase
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
        setUser(JSON.parse(cachedUser));
    }
}, []);

// Helper function to extract initials safely from the user's name
const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
};
  return (

    <div className='flex ml-auto gap-5 items-center'>
        <div className='relative cursor-pointer'>
          <img src={assets.notification_icon} alt="notifications" className='h-6 w-6'/>
          <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold
          rounded-full h-5 w-5 flex items-center justify-center'>2</span>
        </div>
        <button className='border border-blue-900 rounded-full
         w-8 h-8 bg-blue-900 text-white font-semibold hover:bg-blue-800'> {getInitials(user?.fullName)}</button>
    </div>

  )
}

export default Navbar
