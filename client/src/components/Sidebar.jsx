//import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = ({ role = 'student', isOpen = false, onClose = () => {} }) => {
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
      <aside className={`fixed md:relative w-72 min-h-screen bg-blue-900 text-white px-6 py-8 z-40 transition-transform duration-300 md:translate-x-0 ${
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
         
        <hr className='w-full text-gray-400 p-5'/>

        <nav className='pb-10'>
          <ul className="space-y-3">
            {items.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className="block rounded-lg px-4 py-3 text-sm hover:bg-blue-800 text-lg text-gray-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <hr className='w-full text-gray-400'/>
      </aside>
    </>
  )
}

export default Sidebar