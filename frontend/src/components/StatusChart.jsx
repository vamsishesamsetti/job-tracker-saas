function StatusChart({ data }) {

  // ✅ SAFETY CHECK
  if (!data || data.length === 0) {
    return (
      <div className="mt-6 text-center text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="mt-6">

      <h2 className="font-bold mb-2">
        Status Breakdown
      </h2>

      <div className="space-y-2">

        {data.map((item, index) => (
          <div key={index} className="flex justify-between">

            <span>{item.status}</span>
            <span>{item.count}</span>

          </div>
        ))}

      </div>

    </div>
  );
}

export default StatusChart;