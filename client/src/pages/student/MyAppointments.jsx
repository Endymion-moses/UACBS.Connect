//import React from 'react'

import  { useState } from 'react';
import { APPOINTMENTS } from '../../services/appointmentServices';
import { TABS } from '../../services/appointmentServices';



export default function AppointmentDashboard() {
  // 2. Track the active tab state
  const [appointments, setAppointments] = useState(APPOINTMENTS)
  const [activeTab, setActiveTab] = useState('All');

   const handleCancel = (id) => {
    setAppointments(prev => 
      prev.map(app => app.id === id ? { ...app, status: 'Cancelled' } : app)
    );
  };

  // 3. Filter data based on active tab
  const filteredAppointments = activeTab === 'All' 
    ? appointments 
    : appointments.filter(app => app.status === activeTab);

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      {/* Tab Buttons */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          const count = tab === 'All' ? appointments.length : appointments.filter(a => a.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                isActive 
                  ? 'bg-blue-900 text-white' 
                  : 'bg-white  hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab} {tab === 'All' && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* Content Cards */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No appointments found.</p>
        ) : (
          filteredAppointments.map((app) => (
            <div key={app.id} className="bg-white border border-slate-150 rounded-xl p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold">
                  {app.initials}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{app.name}</h3>
                  <p className="text-sm text-slate-500">{app.task}</p>
                  <div className="flex gap-4 mt-2 text-xs text-slate-400">
                    <span>📅 {app.date}</span>
                    <span>🕒 {app.time}</span>
                  </div>
                </div>
              </div>
              
              <div className='flex flex-col items-center justify-center gap-4'>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  app.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                  app.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {app.status}
                </span>

                 {app.status === 'Pending' && (
                <button 
                  onClick={() => handleCancel(app.id)}
                  className="text-xs text-red-500 border border-gray-100 rounded-full bg-gray-100 
                  p-2 hover:text-rose-700 font-medium flex items-center gap-1 mt-1 transition-colors"
                >
                  ✕ Cancel
                </button>
              )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
