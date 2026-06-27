const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-xl"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-50">
            <img src={stat.image} alt={stat.name} className="h-8 w-8" />
          </div>
          <div>
            <p className="uppercase">{stat.name}</p>
            <p className="mt-2 text-lg font-bold">{stat.count}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
