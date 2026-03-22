function JobTable({ jobs, onDelete, onEdit, onUpload }) {

  return (
    <table className="w-full mt-6 border rounded-xl overflow-hidden">

      <thead className="bg-gray-100">
        <tr>
          <th className="p-3 text-left">Company</th>
          <th className="p-3 text-left">Role</th>
          <th className="p-3 text-left">Status</th>
          <th className="p-3 text-left">Priority</th>
          <th className="p-3 text-left">Actions</th>
        </tr>
      </thead>

      <tbody>
        {jobs.map((job) => (

          <tr key={job.id} className="border-b hover:bg-gray-50">

            <td className="p-3 font-medium">{job.companyName}</td>

            <td className="p-3 text-gray-600">{job.roleTitle}</td>

            <td className="p-3">
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">
                {job.status}
              </span>
            </td>

            <td className="p-3">
              <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs">
                {job.priority}
              </span>
            </td>

            <td className="p-3 flex gap-2">

              <button
                onClick={() => onEdit(job)}
                className="text-sm bg-yellow-400 px-2 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(job.id)}
                className="text-sm bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>

              <input
                type="file"
                onChange={(e) => onUpload(job.id, e.target.files[0])}
                className="text-sm"
              />

            </td>

          </tr>

        ))}
      </tbody>

    </table>
  );
}

export default JobTable;