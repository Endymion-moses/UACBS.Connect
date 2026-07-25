//import React from 'react'
import NotificationItem from '../../components/NotificationBell.jsx';
import { useNotifications } from "../../hooks/useNotifications";

const StudentNotificationView = () => {
  const { notifications, markAsRead } = useNotifications();

  return (
    <div className="space-y-4">
      {notifications.map((item) => (
        <NotificationItem
          key={item.id}
          item={item}
          onMarkAsRead={markAsRead}
        />
      ))}
      {notifications.length === 0 && (
        <p className="text-slate-500">No notifications yet.</p>
      )}
    </div>
  );
};

export default StudentNotificationView;
