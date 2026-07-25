import { useState } from 'react';

const ProfileCard = ({ role = 'student', initialData }) => {
    const backendRole = role.toUpperCase();



    // 1. Initial State Definition Helper Function
    const createFormState = (data) => ({
        fullName: data?.fullName || '',
        email: data?.email || '',
        phone: data?.student?.phoneNumber || data?.lecturer?.phoneNumber || data?.admin?.phoneNumber || '',
        department: data?.student?.department || data?.lecturer?.department || '',
        programme: data?.student?.programme || '',
        specialization: data?.lecturer?.specialization || '',
        officeLocation: data?.lecturer?.officeLocation || '',
        newPassword: ''
    });

    const [formData, setFormData] = useState(() => createFormState(initialData));
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    // 2. Fix State Stagnation: Sync form data when initialData loads from the server


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        // 3. Tanzanian Phone Validation
        if (backendRole === 'STUDENT' || backendRole === 'LECTURER') {
            const cleanPhone = formData.phone.replace(/[\s\-()]/g, "");

              // 2. Validate format and exact length constraints
    const isLocalValid = cleanPhone.startsWith('0') && cleanPhone.length === 10;
    const isInternationalValid = cleanPhone.startsWith('+255') && cleanPhone.length === 13;
    const isNoPlusValid = cleanPhone.startsWith('255') && cleanPhone.length === 12;


            if (!isLocalValid && !isInternationalValid && !isNoPlusValid) {
                setMessage({
                    text: "Invalid Tanzanian phone number length. Use a domestic layout (e.g., 0740544147) or international layout (e.g., +255740544147).",
                    type: "error"
                });
                return;
            }
        }

        setIsLoading(true);

        // 4. Construct structural payload for your backend route controller
        const payload = {
            fullName: formData.fullName,
            email: formData.email,
            role: backendRole,
            ...(formData.newPassword && { password: formData.newPassword }),
            profileInfo: {
                department: formData.department,
                phoneNumber: formData.phone,
                ...(backendRole === 'STUDENT' && { programme: formData.programme }),
                ...(backendRole === 'LECTURER' && {
                    specialization: formData.specialization,
                    officeLocation: formData.officeLocation
                })
            }
        };

                try {
            // 1. Grab the token from wherever you store it upon successful login
            const token = localStorage.getItem("token"); // or from your auth context/state

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/update`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                // 2. Add the secure token header to pass the verifyToken middleware guard
                'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || "Failed to save data changes");
            }

            setMessage({ text: 'Changes saved successfully!', type: 'success' });
            setFormData(prev => ({ ...prev, newPassword: '' }));

            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }
        } catch (error) {
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name || !name.trim()) return 'U';
        const cleanName = name.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.)\s+/i, '').trim();
        if (!cleanName) return 'U';
        const parts = cleanName.split(/\s+/);
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return parts[0][0].toUpperCase();
    };

    return (
        <div>
            <div className='flex flex-col pl-33 pb-5'>
                <h1 className='font-bold text-2xl'>My Profile</h1>
                <p className='text-gray-400'>Manage your personal information</p>
            </div>

            <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden font-sans text-slate-700">
                <div className="bg-blue-900 h-32 relative px-8 flex items-end">
                    <div className="absolute -bottom-6 left-8 w-16 h-16 bg-blue-950 border-4 border-white text-white rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm select-none">
                        {getInitials(formData.fullName)}
                    </div>
                </div>

                <div className="pt-8 px-8 pb-4">
                    <h2 className="text-xl font-bold text-slate-800 leading-tight">
                        {formData.fullName || 'User Profile'}
                    </h2>
                    <p className="text-sm text-slate-400 capitalize">
                        {role} · {formData.department || 'General'}
                    </p>
                </div>

                {message.text && (
                    <div className={`mx-8 p-4 rounded-xl text-sm border ${
                        message.type === 'success'
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-900 shadow-sm" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-900 shadow-sm" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">Phone Number</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required placeholder="e.g., 0712345678" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-900 shadow-sm" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">Department</label>
                            <input type="text" name="department" value={formData.department} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-900 shadow-sm" />
                        </div>

                        {/* STUDENT EXCLUSIVE VIEWS */}
                        {backendRole === 'STUDENT' && (
                            <div>
                                <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">Programme / Course</label>
                                <input type="text" name="programme" value={formData.programme} onChange={handleChange} required placeholder="e.g., BSc IT" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-900 shadow-sm" />
                            </div>
                        )}

                        {/* LECTURER EXCLUSIVE VIEWS */}
                        {backendRole === 'LECTURER' && (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">Specialization</label>
                                    <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} required placeholder="e.g., Artificial Intelligence" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-900 shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">Office Location</label>
                                    <input type="text" name="officeLocation" value={formData.officeLocation} onChange={handleChange} required placeholder="e.g., Block A, Room 204" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-900 shadow-sm" />
                                </div>
                            </>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">New Password</label>
                        <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="Leave blank to keep current password" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-900 shadow-sm" />
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" disabled={isLoading} className="inline-flex items-center justify-center rounded-2xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )}

export default ProfileCard;