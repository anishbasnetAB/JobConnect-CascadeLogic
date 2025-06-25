import axios from './axios';


export const unsaveJob = async (jobId) => {
  const token = localStorage.getItem('token');
  return axios.delete(`/jobseeker/save/${jobId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getSavedJobs = async () => {
  const token = localStorage.getItem('token');
  return axios.get('/jobseeker/saved', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const saveJob = async (jobId) => {
  const token = localStorage.getItem('token');
  return axios.post(`/jobseeker/save/${jobId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};