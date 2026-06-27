import { useSearchParams } from "react-router-dom";
import { TABS, countByStatus } from "../../services/appointmentServices";
import useAppointment from "../../hooks/useAppointment";

const statusStyles = {
  Approved: "bg-emerald-50 text-emerald-600",
  Pending: "bg-amber-50 text-amber-600",
  Rejected: "bg-rose-50 text-rose-600",
  Completed: "bg-blue-50 text-blue-600",
  Cancelled: "bg-slate-100 text-slate-500",
};

export default function AppointmentDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { appointments, updateAppointmentStatus } = useAppointment();
  const activeTab = searchParams.get("tab") || "All";

  const filteredAppointments =
    activeTab === "All"
      ? appointments
      : appointments.filter((appointment) => appointment.status === activeTab);

  const getTabCount = (tab) => {
    if (tab === "All") {
      return appointments.length;
    }

    return countByStatus(appointments, tab);
  };

  const handleCancel = (id) => {
    updateAppointmentStatus(id, "Cancelled");
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Appointments</h1>
        <p className="text-sm text-slate-500">
          {countByStatus(appointments, "Pending")} pending appointments
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setSearchParams({ tab })}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition whitespace-nowrap ${
                isActive
                  ? "border-blue-900 bg-blue-900 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
              }`}
            >
              {tab === "All" ? tab : `${tab} (${getTabCount(tab)})`}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4">
        {filteredAppointments.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400">
            No {activeTab.toLowerCase()} appointments found.
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-900 font-bold text-white">
                    {appointment.initials}
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">{appointment.name}</h2>
                    <p className="text-sm text-slate-500">{appointment.task}</p>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
                      <span>{appointment.date}</span>
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      statusStyles[appointment.status] || "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {appointment.status}
                  </span>

                  {appointment.status === "Pending" && (
                    <button
                      type="button"
                      onClick={() => handleCancel(appointment.id)}
                      className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
