//import React from 'react'
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {assets} from '../assets/assets'
import { useNotifications } from "../hooks/useNotifications";

const Navbar = () => {
   const [user] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
   });
   const { unreadCount } = useNotifications();
   const location = useLocation();
   const notificationsPath = location.pathname.startsWith("/lecturer") ? "/lecturer/notifications" : "/student/notifications";

// Helper function to extract initials safely from the user's name
const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
};
  return (

    <div className='flex ml-auto gap-5 items-center'>
        <Link to={notificationsPath} className='relative cursor-pointer' aria-label={`${unreadCount} unread notifications`}>
          <img src={assets.notification_icon} alt="notifications" className='h-6 w-6'/>
          {unreadCount > 0 && <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold
          rounded-full h-5 min-w-5 px-1 flex items-center justify-center'>{unreadCount > 99 ? "99+" : unreadCount}</span>}
        </Link>
        <button className='border border-blue-900 rounded-full
         w-8 h-8 bg-blue-900 text-white font-semibold hover:bg-blue-800'> {getInitials(user?.fullName)}</button>
    </div>

  )
}

export default Navbar
