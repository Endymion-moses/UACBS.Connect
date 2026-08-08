import { useCallback, useEffect, useState } from "react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const mapRequest = (appointment) => ({
  id: appointment.id,
  student: appointment.student.user.fullName,
  studentId: appointment.student.user.email,
  initials: appointment.student.user.fullName.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase(),
  topic: appointment.reason,
  date: appointment.appointmentDate,
  time: appointment.timeSlot,
  status: appointment.status[0] + appointment.status.slice(1).toLowerCase(),
});

const readApiResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;
  if (!response.ok) {
    if (response.status === 404) throw new Error("The appointment requests API route is not deployed on the server yet.");
    throw new Error(data?.message || `Request failed (${response.status})`);
  }
  if (!data) throw new Error("The server returned an unexpected response.");
  return data;
};

export const useLecturerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadRequests = useCallback(async () => {
    try {
      setError("");
      const response = await fetch(`${apiBaseUrl}/appointments/lecturer/requests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        credentials: "include",
      });
      const data = await readApiResponse(response);
      setRequests(data.map(mapRequest));
    } catch (requestError) {
      setError(requestError.message || "Could not load appointment requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  const updateRequestStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");
      const response = await fetch(`${apiBaseUrl}/appointments/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        credentials: "include",
        body: JSON.stringify({ status: status.toUpperCase() }),
      });
      const data = await readApiResponse(response);
      setRequests((current) => current.map((request) => request.id === id ? mapRequest(data) : request));
      window.dispatchEvent(new Event("appointments-updated"));
      return data;
    } catch (requestError) {
      setError(requestError.message || "Could not update the appointment request.");
      throw requestError;
    } finally {
      setUpdatingId(null);
    }
  };

  return { requests, loading, error, updatingId, updateRequestStatus };
};

export default useLecturerRequests;
