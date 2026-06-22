import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import {assets} from '../assets/assets'

const StudentLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false)

	return (
		<div className="flex min-h-screen">
			<Sidebar role="student" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
			<main className="flex-1 flex flex-col bg-gray-100">
				<div className="fixed top-0 left-0 right-0 md:left-72 z-30 flex justify-between items-center bg-white border-b border-gray-200 p-4">
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="md:hidden text-gray-700 hover:text-gray-900"
					>
						<img src={assets.menu_icon} alt="" className='h-5 w-5 ' />
					</button>
					<Navbar />
				</div>

				<div className="pt-20 p-5">
					<Outlet />
				</div>
			</main>
		</div>
	)
}

export default StudentLayout
