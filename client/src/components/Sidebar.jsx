//import React from 'react'
import { useState, useEffect } from "react";
import { Link ,useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = ({ role = 'student', isOpen = false, onClose = () => {} }) => {
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

  const navigate = useNavigate();

  const handleSignOut = () => {
    // Optional: Confirm action with user
    const confirmSignOut = window.confirm("Are you sure you want to sign out?");
    if (!confirmSignOut) return;

    // Clear saved session keys
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isLoggedIn");

    // Close mobile drawer menu overlay if open
    onClose();

    // Redirect the user back to the login screen route
    navigate("/");
  };
  const menuItems = {
    student: [
      { path: '/student/dashboard', label: 'Dashboard' },
      { path: '/student/book', label: 'Book Appointment' },
      { path: '/student/appointments', label: 'My Appointments' },
      { path: '/student/notifications', label: 'Notifications' },
      { path: '/student/profile', label: 'My Profile' },
    ],
    lecturer: [
      { path: '/lecturer/dashboard', label: 'Dashboard' },
      { path: '/lecturer/requests', label: 'Requests' },
      {path:'/lecturer/availability', label:'My Availability'},
      { path: '/lecturer/schedule', label: 'Schedule' },
      { path: '/lecturer/notifications', label: 'Notifications' },
      { path: '/lecturer/profile', label: 'My Profile' },
    ],
    admin: [
      { path: '/admin/dashboard', label: 'Dashboard' },
      { path: '/admin/users', label: 'Users' },
      { path: '/admin/departments', label: 'Departments' },
      { path: '/admin/reports', label: 'Reports' },
      { path: '/admin/settings', label: 'Settings' },
    ],
  }

  const items = menuItems[role] || menuItems.student

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-transparent z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky md:top-0 w-70 h-screen overflow-y-auto bg-blue-900 text-white px-6 py-8 z-40 transition-transform duration-300 md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:block`}>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={assets.cap_icon} alt="UACBS logo" className="h-12 w-12 border border-white bg-white rounded-full" />
            <div>
              <h3 className="text-xl font-bold">UACBS</h3>
              <p className="text-sm text-blue-200">Consultation System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-white hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <hr className='w-full text-gray-400 p-3'/>

        <nav className='pb-10'>
          <ul className="space-y-3">
            {items.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className="block rounded-lg px-4 py-1 text-sm hover:bg-blue-800 text-lg text-gray-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>


        <hr className='w-full text-gray-400 '/>

        <div className='pt-10 flex flex-col gap-4'>
    {/* User Profile Info block */}
    <div className="flex items-center gap-3 px-2 pt-20">

        {/* Dynamic Avatar Initials Circle */}
        <div className="w-10 h-10 rounded-full bg-white text-blue-900 font-bold text-sm flex items-center justify-center shrink-0 shadow-sm select-none">
            {getInitials(user?.fullName)}
        </div>

        <div className="overflow-hidden text-white">
            {/* Dynamic Full Name Insertion */}
            <h4 className="font-semibold text-sm truncate">
                {user?.fullName || "Loading User..."}
            </h4>

            {/* Dynamic Metadata Block Mapping */}
            <p className="text-xs text-blue-200 truncate capitalize">
                {user?.student?.department || user?.lecturer?.department || "Academic Department"}
                {user?.role === "STUDENT" && user?.student?.programme && ` · ${user.student.programme}`}
                {user?.role === "LECTURER" && " · Lecturer"}
                {user?.role === "ADMIN" && " · System Admin"}
            </p>
        </div>
      </div>



          {/* Functional Sign Out Button Element */}
         <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-200 hover:bg-red-600/20 hover:text-red-300 transition-all text-left group"
          >
            <svg
              className="w-5 h-5 group-hover:translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar