import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/jobs/my-jobs', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await axios.delete(`/jobs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const handleStop = async (id) => {
    try {
      await axios.patch(`/jobs/${id}/stop`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert('Action failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">My Job Posts</h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : jobs.length === 0 ? (
        <p className="text-center text-gray-500">You have not posted any jobs yet.</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="border border-gray-200 rounded shadow-sm p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                  <p className="text-sm text-gray-500">{job.location || 'N/A'}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                    job.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {job.isActive ? 'Active' : 'Closed'}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
  <button
    onClick={() => navigate(`/employer/applicants/${job._id}`)}
    className="text-blue-600 hover:bg-blue-50 border border-blue-100 rounded px-2 py-0.5 text-xs font-medium transition"
    title="View Applicants"
  >
    View
  </button>
  <button
    onClick={() => handleStop(job._id)}
    disabled={!job.isActive}
    className={`text-yellow-600 hover:bg-yellow-50 border border-yellow-100 rounded px-2 py-0.5 text-xs font-medium transition ${
      !job.isActive ? 'opacity-50 cursor-not-allowed' : ''
    }`}
    title="Stop Applications"
  >
    Stop
  </button>
  <button
    onClick={() => navigate(`/employer/edit-job/${job._id}`)}
    className="text-green-600 hover:bg-green-50 border border-green-100 rounded px-2 py-0.5 text-xs font-medium transition"
    title="Edit Job"
  >
    Edit
  </button>
  <button
    onClick={() => handleDelete(job._id)}
    className="text-red-600 hover:bg-red-50 border border-red-100 rounded px-2 py-0.5 text-xs font-medium transition"
    title="Delete Job"
  >
    Delete
  </button>
</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyJobs;