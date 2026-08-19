const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-xl sm:gap-4 sm:p-5"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 sm:h-14 sm:w-14 sm:rounded-3xl">
            <img src={stat.image} alt={stat.name} className="h-8 w-8" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs uppercase sm:text-sm">{stat.name}</p>
            <p className="mt-2 text-lg font-bold">{stat.count}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
