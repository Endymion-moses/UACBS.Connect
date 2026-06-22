//import React from 'react'

import ProfileCard from "../../components/ProfileCard"

const Profile = () => {

   const lecturerData = {
    fullName: 'Dr. Amara Nwosu',
    idNumber: 'STAFF/2018/047',
    email: 'a.nwosu@university.edu',
    phone: '+255 754 987 321',
    department: 'Computer Science',
    officeLocation: 'Block A, Room 204' // Will explicitly show up on screen
  };

  return (
    <div>
        <ProfileCard role="lecturer" initialData={lecturerData}/>
    </div>
  )
}

export default Profile
