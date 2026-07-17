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
  { id: 5, name: 'Dr. Tawheed Nwosu', task: 'Final year project supervision', date: '2026-06-20', time: '12:00 AM', status: 'Completed', initials: 'TA' },
  { id: 6, name: 'Dr. Nadil Nwosu', task: 'Final year project supervision', date: '2026-06-20', time: '12:00 AM', status: 'Pending', initials: 'NA' },
  { id: 7, name: 'Dr. Nadil Tuwano', task: 'Final year project supervision', date: '2026-06-21', time: '12:00 AM', status: 'Pending', initials: 'NT' }
];

export const LECTURERS = [
  { id: 1, name: 'Dr. Amara Nwosu', department: 'Computer Science', initials: 'DA', available: true },
  { id: 2, name: 'Prof. David Osei', department: 'Mathematics', initials: 'PD', available: true },
  { id: 3, name: 'Dr. Kwame Mensah', department: 'Engineering', initials: 'KM', available: false },
  { id: 4, name: 'Prof. Sarah Kimani', department: 'Business', initials: 'SK', available: true },
];

export const LECTURER_REQUESTS = [
  { id: 1, student: "Amina Diallo", studentId: "CS/2022/001", initials: "AD", topic: "Final year project supervision - need feedback on chapter 3 methodology", date: "2026-06-20", time: "10:00 AM", status: "Pending" },
  { id: 2, student: "Kweku Asante", studentId: "CS/2022/045", initials: "KA", topic: "Career guidance and internship opportunities in data science", date: "2026-06-21", time: "2:00 PM", status: "Pending" },
  { id: 3, student: "Zara Okafor", studentId: "CS/2021/112", initials: "ZO", topic: "Algorithm assignment clarification on dynamic programming", date: "2026-06-19", time: "11:00 AM", status: "Approved" },
  { id: 4, student: "Ibrahima Sow", studentId: "CS/2023/031", initials: "IS", topic: "Database normalization and ER diagram review", date: "2026-06-18", time: "3:00 PM", status: "Rejected" },
  { id: 5, student: "Nia Mensah", studentId: "CS/2022/078", initials: "NM", topic: "Research paper review before department presentation", date: "2026-06-25", time: "1:00 PM", status: "Approved" },
];

export const TABS = ['All', 'Approved', 'Pending', 'Rejected', 'Completed', 'Cancelled'];




export const AVAILABLE_TIMES = ['08:00 AM', '09:30 AM', '10:00 PM', '12:30 PM', '02:00 PM', '03:00 PM' , '04:00 PM' , '07:00 PM'];

const getDateKey = (date = new Date()) => date.toISOString().slice(0, 10);
const getMonthKey = (date = new Date()) => getDateKey(date).slice(0, 7);

export const countByStatus = (records, status) =>
  records.filter((record) => record.status === status).length;

export const countUpcoming = (records, today = new Date()) => {
  const todayKey = getDateKey(today);
  const inactiveStatuses = ["Cancelled", "Completed", "Rejected"];

  return records.filter((record) =>
    record.date >= todayKey && !inactiveStatuses.includes(record.status)
  ).length;
};

export const countThisMonth = (records, today = new Date()) => {
  const monthKey = getMonthKey(today);

  return records.filter((record) => record.date.startsWith(monthKey)).length;
};

export const countUniqueBy = (records, fieldName) =>
  new Set(records.map((record) => record[fieldName])).size;
