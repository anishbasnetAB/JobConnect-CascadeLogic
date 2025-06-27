import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`/jobs/${jobId}`);
        setJob(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-sm text-gray-600 mt-2">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center">
        <p className="text-lg text-red-500">Job not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-xl p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{job.title}</h1>
        <h2 className="text-lg text-gray-600 mb-1">{job.companyName}</h2>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <p><strong>Location:</strong> {job.location || 'N/A'}</p>
          <p><strong>Pay:</strong> {job.pay || 'N/A'}</p>
          <p><strong>Deadline:</strong> {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>

      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {job.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <p className="text-gray-700 text-sm leading-relaxed">{job.description}</p>

      {job.requirements && job.requirements.length > 0 && (
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-1">Requirements</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            {job.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>
      )}

      {job.responsibilities && job.responsibilities.length > 0 && (
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-1">Responsibilities</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            {job.responsibilities.map((resp, idx) => (
              <li key={idx}>{resp}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={() => navigate(`/apply/${job._id}`)}
          className="bg-blue-600 text-white text-sm font-medium px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default JobDetail;