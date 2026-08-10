import { useCallback, useEffect, useState } from "react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const titleCase = (status) => status[0] + status.slice(1).toLowerCase();
const initials = (name) => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

const mapAppointment = (appointment) => ({
  id: appointment.id,
  name: appointment.lecturer.user.fullName,
  initials: initials(appointment.lecturer.user.fullName),
  task: appointment.reason,
  date: appointment.appointmentDate,
  time: appointment.timeSlot,
  status: titleCase(appointment.status),
});

const readApiResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;
  if (!response.ok) {
    if (response.status === 404) throw new Error("The appointments API route is not deployed on the server yet.");
    throw new Error(data?.message || `Request failed (${response.status})`);
  }
  if (!data) throw new Error("The server returned an unexpected response.");
  return data;
};

export const useAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAppointments = useCallback(async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/appointments/mine`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        credentials: "include",
      });
      const data = await readApiResponse(response);
      setAppointments(data.map(mapAppointment));
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Could not load appointments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
    const refresh = () => loadAppointments().catch(() => {});
    window.addEventListener("notifications-updated", refresh);
    return () => window.removeEventListener("notifications-updated", refresh);
  }, [loadAppointments]);

  const updateAppointmentStatus = async (id, status) => {
    if (status !== "Cancelled") return;
    const response = await fetch(`${apiBaseUrl}/appointments/${id}/cancel`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      credentials: "include",
    });
    const data = await readApiResponse(response);
    setAppointments((current) => current.map((appointment) => appointment.id === id ? mapAppointment(data) : appointment));
  };

  return { appointments, loading, error, updateAppointmentStatus };
};

export default useAppointment;
