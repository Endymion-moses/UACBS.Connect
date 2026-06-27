import { useEffect, useState } from "react";
import { APPOINTMENTS } from "../services/appointmentServices";

const STORAGE_KEY = "uacbs-appointments";

const getSavedAppointments = () => {
  const savedAppointments = localStorage.getItem(STORAGE_KEY);

  if (!savedAppointments) {
    return APPOINTMENTS;
  }

  try {
    return JSON.parse(savedAppointments);
  } catch {
    return APPOINTMENTS;
  }
};

export const useAppointment = () => {
  const [appointments, setAppointments] = useState(getSavedAppointments);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments]);

  const updateAppointmentStatus = (id, status) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === id ? { ...appointment, status } : appointment
      )
    );
  };

  return {
    appointments,
    updateAppointmentStatus,
  };
};

export default useAppointment;
