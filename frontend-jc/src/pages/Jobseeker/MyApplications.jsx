import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchApplications = async () => {
    try {
      const res = await axios.get('/applications/my');
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load applications');
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const validApplications = applications.filter(app => app.job);

  const filteredApplications = validApplications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">My Applications</h1>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        {['all', 'shortlisted', 'applied', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
              filter === status
                ? 'bg-blue-500 text-white'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {filteredApplications.length === 0 ? (
        <p className="text-gray-600">No applications found for this filter.</p>
      ) : (
        <div className="space-y-5">
          {filteredApplications.map(app => (
            <div
              key={app._id}
              className="bg-white shadow-lg rounded-xl p-5 flex justify-between items-center hover:shadow-xl transition-shadow"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{app.job.title}</h2>
                <p className="text-sm text-gray-700">{app.job.companyName}</p>
                <p className="text-sm text-gray-500">{app.job.location}</p>
                <p className="text-sm mt-1">
                  <span className="font-medium text-gray-700">Status:</span>{' '}
                  <span className={
                    app.status === 'rejected'
                      ? 'text-red-500'
                      : app.status === 'applied'
                      ? 'text-blue-500'
                      : app.status === 'shortlisted'
                      ? 'text-green-500'
                      : 'text-gray-700'
                  }>
                    {app.status}
                  </span>
                </p>
              </div>

              <div>
                <button
                  onClick={() => window.open(`/jobs/${app.job._id}`, '_blank')}
                  className="border border-blue-500 text-blue-500 text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition"
                >
                  View Job
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;