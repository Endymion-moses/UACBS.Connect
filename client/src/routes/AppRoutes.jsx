import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";

import StudentLayout from "../layouts/StudentLayout";
import LecturerLayout from "../layouts/LecturerLayout";
import AdminLayout from "../layouts/AdminLayout";
import Register from "../pages/auth/register";

// Student pages
import StudentDashboard from "../pages/student/Dashboard";
import BookAppointment from "../pages/student/BookAppointment";
import MyAppointments from "../pages/student/MyAppointments";
import StudentNotifications from "../pages/student/Notifications";
import StudentProfile from "../pages/student/Profile";

// Lecturer pages
import LecturerDashboard from "../pages/lecturer/Dashboard";
import Availability from "../pages/lecturer/Availability";
import LecturerRequests from "../pages/lecturer/Requests";
import LecturerSchedule from "../pages/lecturer/Schedule";
import LecturerNotifications from "../pages/lecturer/Notifications";
import LecturerProfile from "../pages/lecturer/Profile";

// Admin pages
import AdminDashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Departments from "../pages/admin/Departments";
import Reports from "../pages/admin/Reports";
import Settings from "../pages/admin/Settings";


const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register/>}/>

      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="book" element={<BookAppointment />} />
        <Route path="appointments" element={<MyAppointments />} />
        <Route path="notifications" element={<StudentNotifications />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      <Route path="/lecturer" element={<LecturerLayout />}>
        <Route index element={<LecturerDashboard />} />
        <Route path="dashboard" element={<LecturerDashboard />} />
        <Route path="availability" element={<Availability/>}/>
        <Route path="requests" element={<LecturerRequests />} />
        <Route path="schedule" element={<LecturerSchedule />} />
        <Route path="notifications" element={<LecturerNotifications />} />
        <Route path="profile" element={<LecturerProfile />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="departments" element={<Departments />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
