import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';

function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState({ message: '', type: '' }); // type: 'success' | 'error'

  const fetchJob = async () => {
    try {
      const res = await axios.get(`/jobs/${jobId}`);
      setJob(res.data);
    } catch (err) {
      console.error(err);
      setBanner({ message: 'Failed to load job details. Please try again later.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const showBannerAndNavigate = (message, type) => {
    setBanner({ message, type });
    setTimeout(() => {
      navigate('/jobs');
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBanner({ message: '', type: '' });

    try {
      const formData = new FormData();
      formData.append('role', role);
      formData.append('experience', experience);
      if (cv) formData.append('cv', cv);

      await axios.post(`/applications/${jobId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      showBannerAndNavigate('Application submitted successfully!', 'success');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to apply. Please try again.';
      showBannerAndNavigate(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !job) {
    return (
      <div className="max-w-lg mx-auto mt-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-sm text-gray-600 mt-2">Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow rounded p-6 relative">
      {banner.message && (
        <div
          className={`absolute top-0 left-0 right-0 p-2 text-sm text-center font-medium ${
            banner.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {banner.message}
        </div>
      )}

      {job ? (
        <>
          <h1 className="text-xl font-bold mb-2">Apply to {job.title}</h1>
          <h2 className="text-sm text-gray-600 mb-2">{job.companyName}</h2>
          <p className="text-sm text-gray-700 mb-4">{job.description}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Your Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full border border-gray-300 rounded p-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Your Experience (e.g. 3 years)</label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
                className="w-full border border-gray-300 rounded p-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Upload CV (PDF/DOC)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCv(e.target.files[0])}
                className="block w-full text-sm"
              />
              {cv && <p className="text-xs text-gray-500 mt-1">{cv.name}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex justify-center items-center gap-2">
                  <span className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></span>
                  Submitting...
                </span>
              ) : (
                'Submit Application'
              )}
            </button>
          </form>
        </>
      ) : (
        !banner.message && (
          <p className="text-center text-red-500">Job not found</p>
        )
      )}
    </div>
  );
}

export default ApplyJob;