function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">

      <p className="text-gray-500 text-sm mb-2">
        {title}
      </p>

      <p className="text-3xl font-bold text-gray-800">
        {value}
      </p>

    </div>
  );
}

export default StatCard;
