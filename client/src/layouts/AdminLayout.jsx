import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import {assets} from '../assets/assets'

const AdminLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false)

	return (
		<div className="flex min-h-screen overflow-x-hidden">
			<Sidebar role="admin" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
			<main className="flex min-w-0 flex-1 flex-col bg-gray-100">
				<div className="fixed top-0 left-0 right-0 md:left-72 z-30 flex min-h-16 items-center justify-between bg-white border-b border-gray-200 px-4 py-3 sm:px-5">
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="md:hidden text-gray-700 hover:text-gray-900 "
					>
						<img src={assets.menu_icon} alt="" className='h-5 w-5 ' />
					</button>
					<Navbar />
				</div>

                <div className='min-w-0 px-3 pb-5 pt-20 sm:px-5'>
                    <Outlet />
                </div>
			</main>
		</div>
	)
}

export default AdminLayout
