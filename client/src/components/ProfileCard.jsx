import { useState} from 'react';

const ProfileCard = ({ role = 'student', initialData }) => {
  // Initialize state with all possible properties
  const [formData, setFormData] = useState({
     fullName: initialData?.fullName || '',
  idNumber: initialData?.idNumber || '',
  email: initialData?.email || '',
  phone: initialData?.phone || '',
  department: initialData?.department || '',
  officeLocation: initialData?.officeLocation || '',
  yearOfStudy: initialData?.yearOfStudy || '',
  newPassword: ''
  });

  // Sync state if initialData changes or loads from an API


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Saving ${role} profile alterations:`, formData);
    alert('Changes saved successfully!');
  };

  // Helper method to slice out clean text initials
  const getInitials = (name) => {
    if (!name || !name.trim()) return 'U';
    const cleanName = name.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.)\s+/i, '').trim();
    if (!cleanName) return 'U';
    const parts = cleanName.split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden font-sans text-slate-700">

      {/* Blue Header Banner */}
      <div className="bg-blue-900 h-32 relative px-8 flex items-end">
        {/* Avatar Badge Layout */}
        <div className="absolute -bottom-6 left-8 w-16 h-16 bg-blue-950 border-4 border-white text-white rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm select-none">
          {getInitials(formData.fullName)}
        </div>
      </div>

      {/* User Quick Metadata Block */}
      <div className="pt-8 px-8 pb-4">
        <h2 className="text-xl font-bold text-slate-800 leading-tight">
          {formData.fullName || 'User Profile'}
        </h2>
        <p className="text-sm text-slate-400 capitalize">
          {role} · {formData.department || 'General'}
          {role === 'student' && formData.yearOfStudy && ` · Year ${formData.yearOfStudy}`}
        </p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-900 shadow-sm"
            />
          </div>

          {/* Dynamic ID Label */}
          <div>
            <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">
              {role === 'student' ? 'Registration Number' : 'ID Number'}
            </label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              disabled
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-400 cursor-not-allowed shadow-inner"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-900 shadow-sm"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-900 shadow-sm"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-900 shadow-sm"
            />
          </div>

          {/* ================= CONDITIONAL FIELDS DEPENDING ON ACTIVE ROLE ================= */}

          {/* STUDENT VIEW: Shows Year of Study */}
          {role === 'student' && (
            <div>
              <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">Year of Study</label>
              <select
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-900 shadow-sm appearance-none"
              >
                <option value="">Select Year</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>
          )}

          {/* LECTURER VIEW: Shows Office Location */}
          {role === 'lecturer' && (
            <div>
              <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">Office Location</label>
              <input
                type="text"
                name="officeLocation"
                placeholder="e.g., Block A, Room 204"
                value={formData.officeLocation}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-900 shadow-sm"
              />
            </div>
          )}
        </div>

        {/* New Password field remains globally accessible */}
        <div>
          <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">New Password</label>
          <input
            type="password"
            name="newPassword"
            placeholder="Leave blank to keep current password"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 shadow-sm"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-blue-950 text-white font-medium text-sm px-6 py-3 rounded-xl hover:bg-blue-900 transition-colors shadow-md"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileCard;
