// appointments.js
export const appointments = [
  {
    id: 1,
    lecturer: "Dr. Amara Nwosu",
    topic: "Final year project supervision",
    date: "2026-06-20",
    time: "10:00 AM",
    status: "Approved"
  },
  {
    id: 2,
    lecturer: "Prof. David Osei",
    topic: "Mathematics course clarification",
    date: "2026-06-22",
    time: "2:00 PM",
    status: "Pending"
  },
  {
    id: 3,
    lecturer: "Dr. Kwame Mensah",
    topic: "Career guidance discussion",
    date: "2026-06-18",
    time: "11:00 AM",
    status: "Rejected"
  },
  {
    id: 4,
    lecturer: "Prof. Sarah Kimani",
    topic: "Business project feedback",
    date: "2026-06-15",
    time: "3:00 PM",
    status: "Approved"
  },
  {
    id: 3,
    lecturer: "Dr. Amarah Nwosu",
    topic: "Research paper review",
    date: "2026-06-20",
    time: "11:00 AM",
    status: "Completed"
  }
];

export const APPOINTMENTS = [
  { id: 1, name: 'Dr. Amara Nwosu', task: 'Final year project supervision', date: '2026-06-20', time: '10:00 AM', status: 'Approved', initials: 'DA' },
  { id: 2, name: 'Prof. David Osei', task: 'Mathematics course clarification', date: '2026-06-22', time: '2:00 PM', status: 'Pending', initials: 'PD' },
  { id: 3, name: 'Dr. Kwame Mensah', task: 'Career guidance discussion', date: '2026-06-18', time: '11:00 AM', status: 'Rejected', initials: 'DK' },
  { id: 4, name: 'Prof. Sarah Kimani', task: 'Business project feedback', date: '2026-06-23', time: '1:00 PM', status: 'Approved', initials: 'PS' },
];

export const TABS = ['All', 'Approved', 'Pending', 'Rejected', 'Completed', 'Cancelled'];


export const LECTURERS = [
  { id: '1', name: 'Dr. Amara Nwosu', department: 'Computer Science', available: true, initials: 'AN' },
  { id: '2', name: 'Prof. David Osei', department: 'Mathematics', available: true, initials: 'DO' },
  { id: '3', name: 'Dr. Fatima Al-Hassan', department: 'Engineering', available: false, initials: 'FA' },
 { id: '4', name: 'Dr. Kwame Mensah', department: 'Physics', available: true, initials: 'KM' },
  { id: '5', name: 'Prof. Sarah Kimani', department: 'Business', available: true, initials: 'SK' }
];

export const AVAILABLE_TIMES = ['08:00 AM', '09:30 AM', '10:00 PM', '12:30 PM', '02:00 PM', '03:00 PM' , '04:00 PM' , '07:00 PM'];
