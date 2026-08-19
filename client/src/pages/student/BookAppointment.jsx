

import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const initialsFromName = (name) => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();



export default function ConsultationBooking() {
  // --- Form State ---
  const [selectedLecturer, setSelectedLecturer] = useState([]);
  const [selectedDate, setSelectedDate] = useState(''); // Example hardcoded date selection
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [lecturers, setLecturers] = useState([]);
  const [lecturersError, setLecturersError] = useState('');
  const [availability, setAvailability] = useState([]);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const selectedDay = selectedDate
    ? new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "UTC" }).format(new Date(`${selectedDate}T12:00:00Z`))
    : null;
  const availableTimes = availability
    .filter((slot) => slot.dayOfWeek === selectedDay && slot.isAvailable)
    .map((slot) => slot.timeSlot);

  useEffect(() => {
    const loadLecturers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiBaseUrl}/lecturer/lecturers`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          credentials: "include",
        });
        const contentType = response.headers.get("content-type") || "";
        const data = contentType.includes("application/json") ? await response.json() : null;
        if (!response.ok) throw new Error(data?.message || "Could not load lecturers.");

        setLecturers(data.map((lecturer) => ({
          id: lecturer.id,
          name: lecturer.user.fullName,
          department: lecturer.department,
          initials: initialsFromName(lecturer.user.fullName),
          isOnline: lecturer.isOnline,
        })));
      } catch (error) {
        setLecturersError(error.message || "Could not load lecturers.");
      }
    };
    loadLecturers();
  }, []);

  // --- Form Validation ---
  const isFormValid = selectedLecturer && selectedDate && selectedTime && reason.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch(`${apiBaseUrl}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        credentials: "include",
        body: JSON.stringify({ lecturerId: selectedLecturer.id, appointmentDate: selectedDate, timeSlot: selectedTime, reason }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not submit appointment request.");
      navigate("/student/appointments");
    } catch (error) {
      setSubmitError(error.message || "Could not submit appointment request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectLecturer = async (lecturer) => {
    setSelectedLecturer(lecturer);
    setSelectedTime('');
    setAvailability([]);
    try {
      const response = await fetch(`${apiBaseUrl}/lecturer/${lecturer.id}/availability`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not load lecturer availability.");
      setAvailability(data);
    } catch (error) {
      setSubmitError(error.message || "Could not load lecturer availability.");
    }
  };

  //API fetching from the database
 

  return (
    <div className="mx-auto min-h-full max-w-6xl bg-slate-50 p-0 font-sans text-slate-700 sm:p-2">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 items-start gap-4 sm:gap-6 md:grid-cols-2">

        {/* ================= LEFT COLUMN ================= */}
        <div className="space-y-6">

          {/* 1. SELECT LECTURER */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">1 — SELECT LECTURER</h2>
            <div className="space-y-3">
              {lecturersError && <p className="text-sm text-rose-600">{lecturersError}</p>}
              {!lecturersError && lecturers.length === 0 && <p className="text-sm text-slate-400">Loading lecturers...</p>}
              {lecturers.map((lecturer) => {
                const isSelected = selectedLecturer?.id === lecturer.id;
                return (
                  <button
                    key={lecturer.id}
                    type="button"
                    onClick={() => {
                      selectLecturer(lecturer);
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition-all sm:p-4 ${
                      isSelected ? 'border-slate-800 bg-white ring-1 ring-slate-800' : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="min-w-0 flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center">
                        {lecturer.initials}
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate font-semibold text-slate-800 text-sm">{lecturer.name}</h4>
                        <p className="truncate text-xs text-slate-400">{lecturer.department}</p>
                      </div>
                    </div>
                    <span
                      title={lecturer.isOnline ? "Online" : "Offline"}
                      className={`w-2 h-2 rounded-full ${lecturer.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. SELECT DATE (Simplified View placeholder matching the calendar block position) */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">2 — SELECT DATE</h2>
            <div className="border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-sm font-medium mb-2">June 2026</p>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime('');
                }}
                className="w-full max-w-65 border p-2 text-sm text-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="space-y-6">

          {/* 3. SELECT TIME */}
          <div className="flex min-h-35 flex-col justify-center rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4 self-start">3 — SELECT TIME</h2>

            {!selectedDate || !selectedLecturer ? (
              <p className="text-slate-400 text-sm text-center py-4">Pick a lecturer and date first</p>
            ) : (
              <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
                {availableTimes.length === 0 ? (
                  <p className="col-span-2 text-center text-sm text-slate-400">No available time slots for this date.</p>
                ) : availableTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                      selectedTime === time
                        ? 'bg-blue-900 text-white border-grey-100'
                        : 'border-slate-200 hover:border-green-500 hover:bg-green-100'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
          </div>

          {submitError && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{submitError}</p>}

          {/* 4. REASON */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">4 — REASON</h2>
            <div className="relative">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value.slice(0, 300))}
                placeholder="Briefly describe the purpose of this consultation..."
                rows={4}
                className="w-full p-4 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-500 resize-none"
              />
              <div className="text-right text-xs text-slate-400 mt-1">
                {reason.length}/300
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-4 rounded-xl font-medium text-sm transition-all shadow-sm ${
              isFormValid
                ? 'bg-slate-800 text-white hover:bg-slate-900 cursor-pointer'
                : 'bg-slate-300 text-slate-100 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </button>

        </div>
      </form>
    </div>
  );
}
