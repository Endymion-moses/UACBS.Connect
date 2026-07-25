

import { useState } from 'react';
import {LECTURERS} from '../../services/appointmentServices'
import {AVAILABLE_TIMES} from '../../services/appointmentServices'




export default function ConsultationBooking() {
  // --- Form State ---
  const [selectedLecturer, setSelectedLecturer] = useState([]);
  const [selectedDate, setSelectedDate] = useState(''); // Example hardcoded date selection
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  // --- Form Validation ---
  const isFormValid = selectedLecturer && selectedDate && selectedTime && reason.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const submissionData = {
      lecturerId: selectedLecturer.id,
      lecturerName: selectedLecturer.name,
      date: selectedDate,
      time: selectedTime,
      reason: reason,
    };

    console.log('Submitted Data:', submissionData);
    alert('Booking Request Submitted Successfully!');
  };

  //API fetching from the database
 

  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-50 min-h-screen font-sans text-slate-700">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        {/* ================= LEFT COLUMN ================= */}
        <div className="space-y-6">

          {/* 1. SELECT LECTURER */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">1 — SELECT LECTURER</h2>
            <div className="space-y-3">
              {LECTURERS.map((lecturer) => {
                const isSelected = selectedLecturer?.id === lecturer.id;
                return (
                  <button
                    key={lecturer.id}
                    type="button"
                    disabled={!lecturer.available}
                    onClick={() => {
                      setSelectedLecturer(lecturer);
                      setSelectedTime(''); // Reset time when lecturer changes
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                      !lecturer.available ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-100' :
                      isSelected ? 'border-slate-800 bg-white ring-1 ring-slate-800' : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
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
                    <span className={`w-2 h-2 rounded-full ${lecturer.available ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. SELECT DATE (Simplified View placeholder matching the calendar block position) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
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
                className="p-2 border rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="space-y-6">

          {/* 3. SELECT TIME */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm min-h-[140px] flex flex-col justify-center">
            <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4 self-start">3 — SELECT TIME</h2>

            {!selectedDate || !selectedLecturer ? (
              <p className="text-slate-400 text-sm text-center py-4">Pick a lecturer and date first</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_TIMES.map((time) => (
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

          {/* 4. REASON */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
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
            disabled={!isFormValid}
            className={`w-full py-4 rounded-xl font-medium text-sm transition-all shadow-sm ${
              isFormValid
                ? 'bg-slate-800 text-white hover:bg-slate-900 cursor-pointer'
                : 'bg-slate-300 text-slate-100 cursor-not-allowed'
            }`}
          >
            Submit Request
          </button>

        </div>
      </form>
    </div>
  );
}
