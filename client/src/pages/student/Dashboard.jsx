import { useEffect, useState } from "react";
import { assets } from "../../assets/assets"
import { Link } from "react-router-dom"
import { countByStatus, countUpcoming } from '../../services/appointmentServices';
import DashboardStats from "../../components/DashboardStats";
import useAppointment from "../../hooks/useAppointment";
import { useAuth } from "../../context/useAuth";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const initialsFromName = (name) => name
  .split(" ")
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0])
  .join("")
  .toUpperCase();

const StudentDashboard = () => {
  const { appointments } = useAppointment();
  const { user } = useAuth();
  const [lecturers, setLecturers] = useState([]);
  const [lecturersError, setLecturersError] = useState("");
  const recentAppointments = appointments.slice(0, 4);

  useEffect(() => {
    const loadLecturers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLecturersError("Please sign in again to view lecturers.");
        return;
      }

      try {
        const response = await fetch(`${apiBaseUrl}/lecturer/lecturers`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        const contentType = response.headers.get("content-type") || "";
        const data = contentType.includes("application/json") ? await response.json() : null;
        if (!response.ok) {
          throw new Error(data?.message || "Could not load lecturers.");
        }

        setLecturers(data.map((lecturer) => ({
          id: lecturer.id,
          name: lecturer.user.fullName,
          initials: initialsFromName(lecturer.user.fullName),
          department: lecturer.department,
          isOnline: lecturer.isOnline,
        })));
      } catch (error) {
        setLecturersError(error.message || "Could not load lecturers.");
      }
    };

    loadLecturers();
  }, []);
  const studentStats = [
    {
      image: assets.upcoming_icon,
      name: "UPCOMING",
      count: countUpcoming(appointments),
    },
    {
      image: assets.pending_icon,
      name: "PENDING",
      count: countByStatus(appointments, "Pending"),
    },
    {
      image: assets.comppleted_icon,
      name: "COMPLETED",
      count: countByStatus(appointments, "Completed"),
    },
    {
      image: assets.total_icon,
      name: "TOTAL",
      count: appointments.length,
    },
  ];

  const displayName = user?.fullName?.split(" ")[0] || "Student";
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  const greeting = getGreeting();

  return (
    <div className="p-5 flex flex-col">
      <div className="flex flex-row gap-6 pb-5 items-center justify-between sm:flex-row">
        <div>
          <h1 className="text-lg font-bold">{greeting}, {displayName} 👋</h1>
          <p className="text-gray-400 text-sm ">Here's an overview of your consultations.</p>
        </div>

        <div>
          <Link to ="/student/book" className="inline-flex items-center justify-center rounded-2xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
            + Book Consultation
          </Link>
        </div>
      </div>


      <DashboardStats stats={studentStats} />


      <div className="flex flex-col lg:flex-row gap-3 ">
        <div className="pt-10 w-full lg:w-2/3">
          <div className="w-full border border-white bg-white rounded-3xl shadow-sm">
            <div className="flex items-center justify-between p-5">
              <h1 className="text-lg font-semibold">Recent Appointments</h1>
              <Link to="/student/appointments?tab=All" className="text-sm font-semibold text-blue-900 hover:text-blue-700">
                view all
              </Link>

            </div>
            <hr className="text-gray-100"/>
            <div className="p-5 flex flex-col gap-4">
              {recentAppointments.map((appointment) => (
                <div key={appointment.id} className=" rounded-3xl border border-slate-200 hover:bg-gray-100
                 p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{appointment.name}</p>
                    <p className="text-sm text-slate-500">{appointment.task}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span>📅 {appointment.date}</span>
                      <span>🕒 {appointment.time}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    appointment.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                    appointment.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                    'bg-rose-50 text-rose-600'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-10 w-full lg:w-auto">

                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm w-full lg:w-80 pb-15">
                      <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">1 — SELECT LECTURER</h2>
                      <div className=" flex flex-col gap-5 ">
                        {lecturersError && <p className="text-sm text-rose-600">{lecturersError}</p>}
                        {!lecturersError && lecturers.length === 0 && <p className="text-sm text-slate-400">Loading lecturers...</p>}
                        {lecturers.map((lecturer) => {

                          return (
                            <button
                              key={lecturer.id}
                              type="button"
                             className="flex justify-between border border-gray-100 bg-gray-100 p-2 rounded-xl"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center">
                                  {lecturer.initials}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-slate-800 text-sm">{lecturer.name}</h4>
                                  <p className="text-xs text-slate-400">{lecturer.department}</p>
                                </div>
                              </div>

                               <div className="flex items-center justify-center">
                                   <span
                                     title={lecturer.isOnline ? "Online" : "Offline"}
                                     className={`w-2 h-2 rounded-full ${lecturer.isOnline ? "bg-emerald-500" : "bg-slate-300"}`}
                                   />
                               </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

        </div>

      </div>



    </div>
  )
}

export default StudentDashboard
