function StatCard({ title, value, icon, color = "blue" }) {
  const colors = {
    blue:   { bg: "bg-blue-50",   text: "text-blue-600",   val: "text-blue-700"  },
    yellow: { bg: "bg-yellow-50", text: "text-yellow-600", val: "text-yellow-700" },
    green:  { bg: "bg-green-50",  text: "text-green-600",  val: "text-green-700"  },
    red:    { bg: "bg-red-50",    text: "text-red-600",    val: "text-red-700"    },
  };
  const c = colors[color] || colors.blue;

  return (
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        {icon && (
          <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center text-lg`}>
            {icon}
          </div>
        )}
      </div>
      <p className={`text-3xl font-bold ${c.val}`}>{value ?? 0}</p>
    </div>
  );
}

export default StatCard;
