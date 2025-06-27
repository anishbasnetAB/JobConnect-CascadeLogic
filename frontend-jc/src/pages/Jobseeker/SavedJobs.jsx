import React, { useEffect, useState } from 'react';
import { getSavedJobs, unsaveJob } from '../../api/jobSeeker';
import { useNavigate } from 'react-router-dom';

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  const fetchSavedJobs = async () => {
    try {
      const res = await getSavedJobs();
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load saved jobs');
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      await unsaveJob(jobId);
      alert('Job removed from saved');
      setJobs(jobs.filter(job => job._id !== jobId));
    } catch (err) {
      console.error(err);
      alert('Failed to unsave job');
    }
  };

  const handleApply = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Saved Jobs</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-600">No saved jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map(job => (
            <div key={job._id} className="bg-white shadow rounded p-4 flex flex-col">
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{job.title}</h2>
                <p className="text-sm text-gray-700">{job.companyName}</p>
                <p className="text-sm text-gray-600">{job.location}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {job.description?.substring(0, 100)}...
                </p>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleUnsave(job._id)}
                  className="border border-red-500 text-red-500 px-3 py-1 rounded text-sm hover:bg-red-50"
                >
                  Unsave
                </button>
                <button
                  onClick={() => handleApply(job._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;