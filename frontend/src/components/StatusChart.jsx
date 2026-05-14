import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const PALETTE = {
  APPLIED:   { color: "#3b82f6", label: "Applied"   },
  INTERVIEW: { color: "#f59e0b", label: "Interview" },
  OFFER:     { color: "#22c55e", label: "Offer"     },
  REJECTED:  { color: "#ef4444", label: "Rejected"  },
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow text-sm">
      <span className="font-semibold">{name}</span>: {value}
    </div>
  );
};

function StatusChart({ data }) {
  const formatted = data.map((item) => ({
    name: PALETTE[item.status]?.label || item.status,
    value: item._count.status,
    color: PALETTE[item.status]?.color || "#6b7280",
  }));

  const total = formatted.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-white shadow rounded-xl p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Applications by Status</h2>
        <span className="text-sm text-gray-400">{total} total</span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="h-56 w-full md:w-64 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={formatted} dataKey="value" nameKey="name"
                innerRadius={50} outerRadius={90} paddingAngle={3}>
                {formatted.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 grid grid-cols-2 gap-3 w-full">
          {formatted.map((item) => (
            <div key={item.name} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <div>
                <p className="text-sm font-medium text-gray-700">{item.name}</p>
                <p className="text-xl font-bold" style={{ color: item.color }}>{item.value}</p>
              </div>
              <p className="ml-auto text-xs text-gray-400">
                {total > 0 ? Math.round((item.value / total) * 100) : 0}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatusChart;
