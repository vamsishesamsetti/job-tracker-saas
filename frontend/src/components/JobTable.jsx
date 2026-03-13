function JobTable({ jobs, onDelete, onEdit }) {

  if (!jobs || jobs.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg mt-6 p-6 text-center">
        No jobs found
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg mt-6 overflow-hidden">

      <table className="w-full text-left">

        <thead className="border-b bg-gray-50">
          <tr>
            <th className="p-3">Company</th>
            <th className="p-3">Role</th>
            <th className="p-3">Status</th>
            <th className="p-3">Priority</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job) => (

            <tr key={job.id} className="border-b">

              <td className="p-3">{job.companyName}</td>

              <td className="p-3">{job.roleTitle}</td>

              <td className="p-3">{job.status}</td>

              <td className="p-3">{job.priority}</td>

              <td className="p-3 flex gap-2">

                <button
                  onClick={() => onEdit(job)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(job.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}
        </tbody>

      </table>

    </div>
  );
}

export default JobTable;