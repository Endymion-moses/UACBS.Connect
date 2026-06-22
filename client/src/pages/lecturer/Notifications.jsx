//import React from 'react'
import { useState } from 'react';
import NotificationItem from '../../components/NotificationBell.jsx';

const LecturerNotificationView = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 'l1',
      type: 'reminder',
      title: 'New Consultation Request',
      message: 'Student Amina Diallo submitted a booking request for Project Supervision on June 24.',
      timeAgo: '10 mins ago',
      isRead: false,
    },
    {
      id: 'l2',
      type: 'rejected',
      title: 'Appointment Cancelled by Student',
      message: 'John Doe cancelled his scheduled booking for tomorrow at 11:30 AM.',
      timeAgo: '4 hours ago',
      isRead: false,
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

export default LecturerNotificationView;