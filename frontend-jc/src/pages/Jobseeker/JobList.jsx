import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { saveJob } from '../../api/jobSeeker';

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [titleSearch, setTitleSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/jobs');
      const activeJobs = res.data
        .filter(job => job.isActive)
        .map(job => ({
          ...job,
          postedAgo: calculatePostedAgo(job.createdAt)
        }));
      setJobs(activeJobs);
      setFiltered(activeJobs);
    } catch (err) {
      console.error(err);
      alert('Failed to load jobs');
    }
  };

  const calculatePostedAgo = (createdAt) => {
    if (!createdAt) return 'N/A';
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffMs = now - createdDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  useEffect(() => {
    let data = [...jobs];

    if (titleSearch) {
      data = data.filter(job =>
        job.title.toLowerCase().includes(titleSearch.toLowerCase())
      );
    }

    if (locationSearch) {
      data = data.filter(job =>
        job.location.toLowerCase().includes(locationSearch.toLowerCase())
      );
    }

    setFiltered(data);
    setCurrentPage(1); // Reset to first page on filter change
  }, [titleSearch, locationSearch, jobs]);

  const handleSaveJob = async (jobId) => {
    try {
      await saveJob(jobId);
      alert('Job saved successfully!');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to save job';
      alert(msg);
    }
  };

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filtered.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filtered.length / jobsPerPage);

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      {/* Search bar */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Search by job title"
            value={titleSearch}
            onChange={(e) => setTitleSearch(e.target.value)}
            className="w-full border border-gray-300 rounded p-3 text-sm"
          />
          <input
            type="text"
            placeholder="Search by location"
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            className="w-full border border-gray-300 rounded p-3 text-sm"
          />
        </div>
      </div>

      <p className="text-xl text-gray-500 mb-4">{filtered.length} Software Engineer jobs</p>

      {/* Job cards */}
      <div className="space-y-4">
        {currentJobs.length === 0 ? (
          <p className="text-center text-gray-800">No jobs found</p>
        ) : (
          currentJobs.map(job => (
            <div key={job._id} className="bg-white shadow rounded p-4">
              <h2 className="font-semibold text-lg">{job.title}</h2>
              <p className="text-sm text-gray-600">{job.companyName} - {job.location}</p>
              <p className="text-sm mt-1">
                <span className="text-gray-500">Posted {job.postedAgo} • </span>
                <span className={`text-xs font-semibold inline-block rounded px-2 py-1 ${
                  job.contractType?.toLowerCase().includes('remote')
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {job.contractType || 'Full-time'}
                </span>
              </p>
              {job.pay && (
                <p className="text-sm font-bold text-blue-700 mt-1">{job.pay}</p>
              )}

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => navigate(`/jobs/${job._id}`)}
                  className="bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-600"
                >
                  Apply
                </button>
                <button
                  onClick={() => handleSaveJob(job._id)}
                  className="border border-blue-500 text-blue-500 text-sm font-medium px-4 py-2 rounded hover:bg-blue-50"
                >
                  Save Job
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 mb-5">
          <nav className="inline-flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 rounded ${
                  num === currentPage
                    ? 'bg-blue-500 text-white'
                    : 'border border-gray-300 bg-white hover:bg-gray-100'
                }`}
              >
                {num}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}

export default JobList;