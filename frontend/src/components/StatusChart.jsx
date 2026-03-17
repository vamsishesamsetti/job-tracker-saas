import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];

function StatusChart({ data }) {

  const formattedData = data.map((item) => ({
    name: item.status,
    value: item._count.status,
  }));

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">

      <h2 className="text-lg font-semibold mb-4">
        Applications by Status
      </h2>

      <div className="h-64">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={formattedData}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label
            >

              {formattedData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default StatusChart;