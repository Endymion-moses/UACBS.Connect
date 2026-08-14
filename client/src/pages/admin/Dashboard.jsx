import React, { useState, useEffect } from 'react'
import DashboardStats from "../../components/DashboardStats"
import { assets } from "../../assets/assets"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart as HBarChart
} from 'recharts'

const AdminDashboard = () => {
  const [stats, setStats] = useState([])
  const [monthlyBookings, setMonthlyBookings] = useState([])
  const [lecturerBookings, setLecturerBookings] = useState([])

  useEffect(() => {
    // Mock data for stats
    setStats([
      { name: "TOTAL USERS", count: 89, image: assets.cap_icon, change: "+4 this month" },
      { name: "APPOINTMENTS", count: 67, image: assets.upcoming_icon, change: "+12 this week" },
      { name: "LECTURERS", count: 12, image: assets.total_icon, change: "" },
      { name: "PENDING", count: 8, image: assets.pending_icon, change: "" }
    ])

    // Mock data for monthly bookings
    setMonthlyBookings([
      { month: "Jan", bookings: 40 },
      { month: "Feb", bookings: 45 },
      { month: "Mar", bookings: 55 },
      { month: "Apr", bookings: 45 },
      { month: "May", bookings: 70 },
      { month: "Jun", bookings: 65 }
    ])

    // Mock data for bookings by lecturer
    setLecturerBookings([
      { name: "Prof. Kimani", bookings: 32 },
      { name: "Dr. Nwosu", bookings: 28 },
      { name: "Prof. Osei", bookings: 24 },
      { name: "Dr. Mensah", bookings: 18 },
      { name: "Dr. Hassan", bookings: 15 }
    ])
  }, [])

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 text-sm mt-1">System overview • June 2026</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.count}</p>
                  {stat.change && (
                    <p className="text-sm text-green-600 mt-2">{stat.change}</p>
                  )}
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <img src={stat.image} alt={stat.name} className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Bookings Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Monthly Bookings</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyBookings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey="bookings" fill="#1e40af" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings by Lecturer Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Bookings by Lecturer</h2>
          <ResponsiveContainer width="100%" height={300}>
            <HBarChart
              data={lecturerBookings}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="name" type="category" stroke="#6b7280" width={180} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey="bookings" fill="#16a34a" radius={[0, 8, 8, 0]} />
            </HBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard