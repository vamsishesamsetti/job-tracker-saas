function JobTable({ jobs }) {
  return (
    <div className="bg-white shadow rounded-lg mt-6">
      <table className="w-full text-left">
        <thead className="border-b">
          <tr>
            <th className="p-3">Company</th>
            <th className="p-3">Role</th>
            <th className="p-3">Status</th>
            <th className="p-3">Priority</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job) => (
            <tr
              key={job.id}
              className="border-b"
            >
              <td className="p-3">
                {job.companyName}
              </td>

              <td className="p-3">
                {job.roleTitle}
              </td>

              <td className="p-3">
                {job.status}
              </td>

              <td className="p-3">
                {job.priority}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JobTable;