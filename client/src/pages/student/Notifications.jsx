//import React from 'react'
import { useState } from 'react';
import NotificationItem from '../../components/NotificationBell.jsx';

const StudentNotificationView = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 's1',
      type: 'approved',
      title: 'Appointment Approved',
      message: 'Dr. Amara Nwosu approved your consultation for June 20 at 10:00 AM.',
      timeAgo: '2 hours ago',
      isRead: false,
    },
    {
      id: 's2',
      type: 'reminder',
      title: 'Appointment Reminder',
      message: 'You have a consultation with Prof. David Osei tomorrow at 2:00 PM.',
      timeAgo: '5 hours ago',
      isRead: false,
    },
    {
      id: 's3',
      type: 'rejected',
      title: 'Appointment Rejected',
      message: 'Dr. Kwame Mensah could not accommodate your June 18 request.',
      timeAgo: '1 day ago',
      isRead: true,
    },
    {
      id: 's4',
      type: 'info',
      title: 'New Slot Available',
      message: 'Dr. Fatima Al-Hassan has opened new consultation slots for next week.',
      timeAgo: '2 days ago',
      isRead: true,
    }
  ]);

  const handleMarkAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  return (
    <div className="space-y-4">
      {notifications.map((item) => (
        <NotificationItem
          key={item.id}
          item={item}
          onMarkAsRead={handleMarkAsRead}
        />
      ))}
      {notifications.length === 0 && (
        <p className="text-slate-500">No notifications yet.</p>
      )}
    </div>
  );
};

export default StudentNotificationView;
