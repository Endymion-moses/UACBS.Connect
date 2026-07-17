import { useState } from "react";
import { countByStatus } from "../../services/appointmentServices";
import useLecturerRequests from "../../hooks/useLecturerRequests";

const REQUEST_TABS = ["All", "Pending", "Approved", "Rejected"];

const statusStyles = {
  Pending: "border-amber-200 bg-amber-50 text-amber-600",
  Approved: "border-emerald-200 bg-emerald-50 text-emerald-600",
  Rejected: "border-rose-200 bg-rose-50 text-rose-600",
};

const formatDate = (date) => {
  const [year, month, day] = date.split("-");

  return `${year}-${month}-${day}`;
};

const Requests = () => {
  const [activeTab, setActiveTab] = useState("All");
  const { requests, updateRequestStatus } = useLecturerRequests();

  const pendingCount = countByStatus(requests, "Pending");
  const filteredRequests =
    activeTab === "All"
      ? requests
      : requests.filter((request) => request.status === activeTab);

  const getTabCount = (tab) => {
    if (tab === "All") {
      return requests.length;
    }

    return countByStatus(requests, tab);
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Appointment Requests</h1>
        <p className="text-sm text-slate-500">{pendingCount} pending requests</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {REQUEST_TABS.map((tab) => {
          const isActive = activeTab === tab;
          const tabCount = getTabCount(tab);

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition whitespace-nowrap ${
                isActive
                  ? "border-blue-900 bg-blue-900 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
              }`}
            >
              {tab === "All" ? tab : `${tab} (${tabCount})`}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4">
        {filteredRequests.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400">
            No {activeTab.toLowerCase()} requests found.
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                    {request.initials}
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">{request.student}</h2>
                    <p className="text-sm text-slate-400">{request.studentId}</p>
                    <p className="mt-1 text-sm text-slate-600">{request.topic}</p>

                    <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-400">
                      <span>{formatDate(request.date)}</span>
                      <span>{request.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-12 sm:items-end">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      statusStyles[request.status]
                    }`}
                  >
                    {request.status}
                  </span>

                  {request.status === "Pending" && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => updateRequestStatus(request.id, "Rejected")}
                        className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                      >
                        X Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => updateRequestStatus(request.id, "Approved")}
                        className="rounded-full border border-emerald-700 bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                      >
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Requests;
