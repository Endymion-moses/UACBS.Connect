

const Notifications = ({ item, onMarkAsRead = () => {} }) => {
  if (!item) return null;
  const { id, type, title, message, timeAgo, isRead } = item;

  // 1. Dynamic configuration based on notification types
  const config = {
    approved: {
      bgIcon: 'bg-emerald-50 text-emerald-600 border-emerald-150',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    reminder: {
      bgIcon: 'bg-blue-50 text-blue-600 border-blue-150',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    rejected: {
      bgIcon: 'bg-rose-50 text-rose-600 border-rose-150',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    info: {
      bgIcon: 'bg-sky-50 text-sky-600 border-sky-150',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  const currentConfig = config[type] || config.info;

  return (
    <div
      onClick={() => !isRead && onMarkAsRead(id)}
      className={`group flex items-start gap-4 p-5 bg-white border border-slate-100 rounded-2xl transition-all duration-200 shadow-sm ${
        !isRead ? 'cursor-pointer hover:bg-gray-400' : 'opacity-85'
      }`}
    >
      {/* Dynamic Status Icon Circle */}
      <div className={`w-11 h-11 rounded-full border flex items-center justify-center shrink-0 ${currentConfig.bgIcon}`}>
        {currentConfig.icon}
      </div>

      {/* Content Text Fields Area */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-slate-800 text-sm tracking-wide leading-tight">
          {title}
        </h4>
        <p className="text-slate-500 text-sm mt-1 leading-normal pr-4">
          {message}
        </p>
        <span className="block text-xs font-medium text-slate-400 mt-2 tracking-wide">
          {timeAgo}
        </span>
      </div>

      {/* Unread Blueprint Dot Indicator */}
      {!isRead && (
        <div className="w-2 h-2 rounded-full bg-blue-900 mt-2 shrink-0 group-hover:scale-110 transition-transform" />
      )}
    </div>
  );
};

export default Notifications;
