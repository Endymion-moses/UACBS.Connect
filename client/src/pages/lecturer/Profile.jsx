import { useEffect, useState } from "react";
import ProfileCard from "../../components/ProfileCard";

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 1. Fetch the logged-in session data from local cache storage
        const cachedUser = localStorage.getItem("user");

        if (cachedUser) {
            // Parse the user record safely from its JSON string format
            setUserData(JSON.parse(cachedUser));
        }

        setIsLoading(false);
    }, []);

    // 2. Guard Check: Display a temporary loading container while reading local state cache
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-slate-500 font-medium">
                Loading profile data...
            </div>
        );
    }

    // 3. Fallback View: If no user is logged in, show an unauthorized alert block
    if (!userData) {
        return (
            <div className="flex items-center justify-center min-h-screen text-rose-600 font-semibold">
                Error: No active user session found. Please log in again.
            </div>
        );
    }

    return (
        <div>
            {/*
               Pass the real, database-mapped values dynamically to your ProfileCard.
               The user role is transformed dynamically (e.g. 'LECTURER' becomes 'lecturer')
            */}
            <ProfileCard
                role={userData.role?.toLowerCase() || 'student'}
                initialData={userData}
            />
        </div>
    );
};

export default Profile;
