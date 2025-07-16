import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data)) {
        setJobs(res.data);
      } else {
        setJobs([]);
        console.error("Expected array, got:", res.data);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load jobs");
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/job/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter((job) => job._id !== id));
      alert("Job deleted successfully");
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete job");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="p-5 flex justify-center">
      <div className="w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4 text-center">All Jobs</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <div className="overflow-x-auto border rounded-md shadow">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="p-2">Job Title</th>
                <th className="p-2">Company</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} className="border-t text-sm">
                  <td className="p-2">{job.title}</td>
                  <td className="p-2">{job.companyName || "N/A"}</td>
                  <td className="p-2">
                    <button
                      onClick={() => deleteJob(job._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500 text-sm">
                    No jobs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;