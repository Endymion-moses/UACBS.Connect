import { useEffect, useMemo, useState } from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const times = [
  { value: "08:00-09:00", label: "8:00 AM" },
  { value: "09:00-10:00", label: "9:00 AM" },
  { value: "10:00-11:00", label: "10:00 AM" },
  { value: "11:00-12:00", label: "11:00 AM" },
  { value: "12:00-13:00", label: "12:00 PM" },
  { value: "13:00-14:00", label: "1:00 PM" },
  { value: "14:00-15:00", label: "2:00 PM" },
  { value: "15:00-16:00", label: "3:00 PM" },
];
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const makeKey = (dayOfWeek, timeSlot) => `${dayOfWeek}|${timeSlot}`;

const readApiResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("The availability API route is not deployed on the server yet.");
    }
    throw new Error(body?.message || body?.error || `Request failed (${response.status})`);
  }
  if (!body) throw new Error("The server returned an unexpected response.");
  return body;
};

const Availability = () => {
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const profile = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("profile") || "null");
    } catch {
      return null;
    }
  }, []);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadAvailability = async () => {
      if (!profile?.id || !token) {
        setError("Your lecturer session could not be found. Please sign in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiBaseUrl}/lecturer/${profile.id}/availability`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        const data = await readApiResponse(response);

        setAvailability(Object.fromEntries(
          data.map(({ dayOfWeek, timeSlot, isAvailable }) => [makeKey(dayOfWeek, timeSlot), isAvailable])
        ));
      } catch (requestError) {
        setError(requestError.message || "Could not load availability");
      } finally {
        setLoading(false);
      }
    };

    loadAvailability();
  }, [profile?.id, token]);

  const toggleSlot = (dayOfWeek, timeSlot) => {
    const key = makeKey(dayOfWeek, timeSlot);
    setAvailability((current) => ({ ...current, [key]: !current[key] }));
    setMessage("");
  };

  const saveAvailability = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    const slots = days.flatMap((dayOfWeek) => times.map(({ value: timeSlot }) => ({
      dayOfWeek,
      timeSlot,
      isAvailable: Boolean(availability[makeKey(dayOfWeek, timeSlot)]),
    })));

    try {
      const response = await fetch(`${apiBaseUrl}/lecturer/availability`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ slots }),
      });
      const data = await readApiResponse(response);

      setAvailability(Object.fromEntries(
        data.map(({ dayOfWeek, timeSlot, isAvailable }) => [makeKey(dayOfWeek, timeSlot), isAvailable])
      ));
      setMessage("Availability saved.");
    } catch (requestError) {
      setError(requestError.message || "Could not save availability");
    } finally {
      setSaving(false);
    }
  };

  const availableCount = Object.values(availability).filter(Boolean).length;

  return (
    <div className="p-6 flex flex-col">
      <div className="flex justify-between w-full gap-4 p-3 pb-6">
        <div>
          <h2 className="text-xl font-bold">My Availability</h2>
          <p className="text-sm text-gray-400">{availableCount} slots available this week</p>
        </div>
        <button
          type="button"
          onClick={saveAvailability}
          disabled={loading || saving || Boolean(error && !Object.keys(availability).length)}
          className="p-2 bg-blue-900 text-white rounded-lg text-sm disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">{message}</p>}

      <div className="overflow-x-auto rounded-xl border border-gray-300 bg-white p-4">
        <div className="grid min-w-[700px] grid-cols-6 gap-2 items-center">
          <div />
          {days.map((day) => <div key={day} className="text-center text-sm font-semibold">{day.slice(0, 3)}</div>)}
          {times.map(({ value, label }) => (
            <div className="contents" key={value}>
              <div className="text-sm text-gray-400">{label}</div>
              {days.map((day) => {
                const isAvailable = Boolean(availability[makeKey(day, value)]);
                return (
                  <button
                    key={makeKey(day, value)}
                    type="button"
                    aria-pressed={isAvailable}
                    aria-label={`${day}, ${label}: ${isAvailable ? "available" : "unavailable"}`}
                    disabled={loading}
                    className={`h-8 rounded-md border text-sm font-semibold disabled:cursor-wait ${isAvailable
                      ? "border-green-500 bg-green-100 text-green-700"
                      : "border-gray-200 bg-gray-100 text-gray-600"}`}
                    onClick={() => toggleSlot(day, value)}
                  >
                    {isAvailable ? "✓" : "–"}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Availability;
