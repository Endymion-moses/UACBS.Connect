//import React from 'react'
import NotificationItem from '../../components/NotificationBell.jsx';
import { useNotifications } from "../../hooks/useNotifications";
import { useState } from "react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const LecturerNotificationView = () => {
  const { notifications, markAsRead, loadNotifications } = useNotifications();
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");

  const respondToAppointment = async (appointmentId, status, notificationId) => {
    try {
      setActionId(notificationId);
      setError("");
      const response = await fetch(`${apiBaseUrl}/appointments/${appointmentId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not update the appointment.");
      await loadNotifications();
      window.dispatchEvent(new Event("appointments-updated"));
    } catch (actionError) {
      setError(actionError.message || "Could not update the appointment.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
      {notifications.map((item) => (
        <NotificationItem
          key={item.id}
          item={item}
          onMarkAsRead={markAsRead}
          onAppointmentAction={respondToAppointment}
          actionInProgress={actionId === item.id}
        />
      ))}
      {notifications.length === 0 && (
        <p className="text-slate-500">No notifications yet.</p>
      )}
    </div>
  );
};

export default LecturerNotificationView;
