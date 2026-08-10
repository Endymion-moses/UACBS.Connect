//import React from 'react'
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import DashboardStats from "../../components/DashboardStats";
import { countByStatus, countThisMonth, countUniqueBy } from "../../services/appointmentServices";
import useLecturerRequests from "../../hooks/useLecturerRequests";
import { useAuth } from "../../context/useAuth";

const LecturerDashboard = () => {
  const { user } = useAuth();
  const { requests } = useLecturerRequests();
  const pendingRequests = requests.filter((request) => request.status === "Pending");
  const todaySchedule = requests.filter((request) => request.date === "2026-06-18");

  const lecturerStats = [
    {
      image: assets.pending_icon,
      name: "PENDING",
      count: countByStatus(requests, "Pending"),
    },
    {
      image: assets.comppleted_icon,
      name: "APPROVED",
      count: countByStatus(requests, "Approved"),
    },
    {
      image: assets.upcoming_icon,
      name: "THIS MONTH",
      count: countThisMonth(requests),
    },
    {
      image: assets.total_icon,
      name: "STUDENTS",
      count: countUniqueBy(requests, "student"),
    },
  ];

  const displayName = user?.fullName || "Lecturer";
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  const greeting = getGreeting();

  return (
    <div className="p-5 flex flex-col">
      <div className="pb-5">
        <h1 className="text-lg font-bold">{greeting}, {displayName}</h1>
        <p className="text-gray-400 text-sm">Your consultation overview</p>
      </div>

      <DashboardStats stats={lecturerStats} />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="pt-10 w-full lg:w-2/3">
          <div className="w-full border border-white bg-white rounded-3xl shadow-sm">
            <div className="flex items-center justify-between p-5">
              <h1 className="text-lg font-semibold">Pending Requests</h1>
              <Link to="/lecturer/requests" className="text-sm font-semibold text-blue-900 hover:text-blue-700">
                View all
              </Link>
            </div>
            <hr className="text-gray-100" />
            <div className="p-5 flex flex-col gap-4">
              {pendingRequests.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No pending requests</p>
              ) : (
                pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-3xl border border-slate-200 hover:bg-gray-100 p-4 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{request.student}</p>
                      <p className="text-sm text-slate-500">{request.topic}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                        <span>{request.date}</span>
                        <span>{request.time}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600">
                      {request.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="pt-10 w-full lg:w-auto">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm w-full lg:w-80">
            <h2 className="text-lg font-semibold">Today's Schedule</h2>
            <p className="text-sm text-slate-400 mb-6">June 18, 2026</p>
            <div className="flex flex-col gap-4">
              {todaySchedule.length === 0 ? (
                <p className="text-slate-400 text-sm">No consultations today</p>
              ) : (
                todaySchedule.map((request) => (
                  <div key={request.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">{request.student}</p>
                    <p className="text-sm text-slate-500">{request.time}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LecturerDashboard
