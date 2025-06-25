import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const schema = yup.object({
  title: yup.string().required('Job title is required'),
  companyName: yup.string().required('Company name is required'),
  pay: yup.string().nullable(),
  location: yup.string().nullable(),
  skills: yup.string().nullable(),
  description: yup.string().nullable(),
  deadline: yup.date().nullable(),
  responsibilities: yup.string().nullable(),
  requirements: yup.string().nullable(),
});

function PostJob() {
  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const [message, setMessage] = useState({ text: '', type: '' });

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        skills: data.skills ? data.skills.split(',').map(s => s.trim()) : [],
        responsibilities: data.responsibilities ? data.responsibilities.split('\n').map(r => r.trim()).filter(r => r) : [],
        requirements: data.requirements ? data.requirements.split('\n').map(r => r.trim()).filter(r => r) : [],
      };

      const res = await axios.post('/jobs', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setMessage({ text: res.data.message || 'Job posted successfully', type: 'success' });
      reset();
      setTimeout(() => navigate('/employer/my-jobs'), 1500);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Job post failed';
      setMessage({ text: msg, type: 'error' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow rounded p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Post a New Job</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {[
          { name: 'title', label: 'Job Title' },
          { name: 'companyName', label: 'Company Name' },
          { name: 'pay', label: 'Pay (e.g. $60k-$80k)' },
          { name: 'location', label: 'Location' },
          { name: 'skills', label: 'Skills (comma separated)' },
        ].map(({ name, label }, idx) => (
          <div key={idx}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  className={`w-full border rounded p-2 text-sm ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
                />
              )}
            />
            {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>}
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium mb-1">Job Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                rows={4}
                {...field}
                className="w-full border border-gray-300 rounded p-2 text-sm"
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Responsibilities (one per line)</label>
          <Controller
            name="responsibilities"
            control={control}
            render={({ field }) => (
              <textarea
                rows={4}
                {...field}
                className="w-full border border-gray-300 rounded p-2 text-sm"
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Requirements (one per line)</label>
          <Controller
            name="requirements"
            control={control}
            render={({ field }) => (
              <textarea
                rows={4}
                {...field}
                className="w-full border border-gray-300 rounded p-2 text-sm"
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Application Deadline</label>
          <Controller
            name="deadline"
            control={control}
            render={({ field }) => (
              <input
                type="date"
                {...field}
                className="w-full border border-gray-300 rounded p-2 text-sm"
              />
            )}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Posting...' : 'Post Job'}
        </button>

        {message.text && (
          <div
            className={`mt-2 text-center text-sm font-medium py-2 rounded ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}

export default PostJob;