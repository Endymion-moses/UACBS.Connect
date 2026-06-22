//import React from 'react'

import ProfileCard from "../../components/ProfileCard"

const Profile = () => {
   const studentData = {
    fullName: 'Amina Diallo',
    idNumber: 'REG/2023/8492',
    email: 'a.diallo@university.edu',
    phone: '+255 612 345 678',
    department: 'Computer Science',
    yearOfStudy: '3'
  };

  return (
    <div>
       <ProfileCard initialData={studentData}/>
    </div>
  )
}

export default Profile
