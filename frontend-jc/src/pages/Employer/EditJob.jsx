import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';

const schema = yup.object({
  title: yup.string().required('Job title is required'),
  companyName: yup.string().required('Company name is required'),
  pay: yup.string().nullable(),
  location: yup.string().nullable(),
  skills: yup.string().nullable(),
  description: yup.string().nullable(),
  deadline: yup.date().nullable(),
});

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get('/jobs/my-jobs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const job = res.data.find(j => j._id === id);
        if (!job) {
          alert('Job not found');
          navigate('/employer/my-jobs');
          return;
        }
        setValue('title', job.title);
        setValue('companyName', job.companyName);
        setValue('pay', job.pay);
        setValue('location', job.location);
        setValue('skills', job.skills?.join(', '));
        setValue('description', job.description);
        setValue('deadline', job.deadline ? job.deadline.slice(0,10) : '');
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert('Failed to load job');
        navigate('/employer/my-jobs');
      }
    };

    fetchJob();
  }, [id, navigate, setValue]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        skills: data.skills ? data.skills.split(',').map(s => s.trim()) : [],
      };

      await axios.put(`/jobs/${id}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      alert('Job updated');
      navigate('/employer/my-jobs');
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Update failed';
      alert(msg);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 bg-white shadow rounded p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow rounded p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Edit Job</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['title', 'companyName', 'pay', 'location', 'skills', 'deadline'].map((field, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium mb-1">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <Controller
                name={field}
                control={control}
                render={({ field: f }) => (
                  <input
                    type={field === 'deadline' ? 'date' : 'text'}
                    className={`w-full border rounded p-2 text-sm ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
                    {...f}
                  />
                )}
              />
              {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]?.message}</p>}
            </div>
          ))}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  rows={4}
                  className={`w-full border rounded p-2 text-sm ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  {...field}
                />
              )}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Updating...' : 'Update Job'}
        </button>
      </form>
    </div>
  );
}

export default EditJob;