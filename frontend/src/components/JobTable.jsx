function JobTable({ jobs, onDelete }) {
  return (
    <div className="bg-white shadow rounded-lg mt-6">

      <table className="w-full text-left">

        <thead className="border-b">
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
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => onDelete(job.id)}
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