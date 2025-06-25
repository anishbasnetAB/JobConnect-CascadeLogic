import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  age: yup.number().typeError('Age must be a number').positive().integer().nullable(),
  country: yup.string().nullable(),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Min 8 characters').required('Password is required'),
  confirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required(),
  userType: yup.string().oneOf(['jobseeker', 'employer']).required('Select a role'),
  companyCard: yup.mixed().nullable(),
  acceptTerms: yup.boolean().oneOf([true], 'You must accept the terms')
});

function Signup() {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { userType: 'jobseeker', acceptTerms: true },
  });

  const userType = watch('userType');
  const [fileName, setFileName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'confirm' && key !== 'acceptTerms') formData.append(key, value);
      });
      if (data.companyCard?.[0]) {
        formData.append('companyCard', data.companyCard[0]);
      }

      const res = await axios.post('/auth/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.status === 201) {
        setMessage({ text: res.data?.message || 'Signup successful!', type: 'success' });
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMessage({ text: res.data?.message || 'Signup failed', type: 'error' });
      }
    } catch (err) {
      console.error('Signup Error:', err);
      const msg =
        err?.response?.data?.message ||
        (err.request ? 'Network Error: Could not reach server.' : 'Unexpected error');
      setMessage({ text: msg, type: 'error' });
    }
  };

  const countries = [
    'Nepal', 'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
    'Germany', 'France', 'Japan', 'China', 'Brazil', 'Russia', 'South Korea',
    'South Africa', 'Italy', 'Spain', 'Mexico', 'Netherlands', 'Sweden',
    'Norway', 'Switzerland', 'Singapore', 'New Zealand', 'Indonesia', 'Malaysia',
    'Philippines', 'Thailand', 'Vietnam', 'UAE', 'Saudi Arabia'
  ];

  return (
    <div className="max-w-md mx-auto mt-12 mb-6 p-6 bg-white rounded-lg shadow-sm space-y-4">
      <h2 className="text-2xl font-bold text-center">Join JobConnect</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Select Role</label>
          <Controller
            name="userType"
            control={control}
            render={({ field }) => (
              <div className="flex bg-gray-100 rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() => field.onChange('jobseeker')}
                  className={`w-1/2 py-2 text-sm font-medium ${
                    field.value === 'jobseeker' ? 'bg-white shadow-inner' : 'text-gray-500'
                  }`}
                >
                  Jobseeker
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange('employer')}
                  className={`w-1/2 py-2 text-sm font-medium ${
                    field.value === 'employer' ? 'bg-white shadow-inner' : 'text-gray-500'
                  }`}
                >
                  Employer
                </button>
              </div>
            )}
          />
          {errors.userType && <p className="text-xs text-red-500 mt-1">{errors.userType.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Name</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Enter your full name"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            )}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Country</label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full border rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Select your country</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}
          />
          {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Age</label>
          <Controller
            name="age"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Enter your age"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            )}
          />
          {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Enter your email"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            )}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            )}
          />
          <button
            type="button"
            className="text-xs text-blue-500 mt-1"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'} Password
          </button>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Confirm Password</label>
          <Controller
            name="confirm"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm your password"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            )}
          />
          <button
            type="button"
            className="text-xs text-blue-500 mt-1"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? 'Hide' : 'Show'} Confirm Password
          </button>
          {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm.message}</p>}
        </div>

        {userType === 'employer' && (
          <div>
            <label className="block mb-1 font-medium">Company Card</label>
            <Controller
              name="companyCard"
              control={control}
              rules={{ required: 'Company card image is required' }}
              render={({ field }) => (
                <label className="w-full flex items-center justify-center border rounded-md py-2 cursor-pointer bg-gray-50">
                  <input
                    type="file"
                    hidden
                    accept="image/jpeg,image/png"
                    onChange={(e) => {
                      field.onChange(e.target.files);
                      setFileName(e.target.files?.[0]?.name || '');
                    }}
                  />
                  {fileName || 'Upload Company ID (JPEG/PNG)'}
                </label>
              )}
            />
            {errors.companyCard && <p className="text-xs text-red-500 mt-1">{errors.companyCard.message}</p>}
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Controller
            name="acceptTerms"
            control={control}
            render={({ field }) => (
              <input type="checkbox" {...field} checked={field.value} className="w-4 h-4" />
            )}
          />
          <span className="text-sm">I accept the Terms and Conditions</span>
        </div>
        {errors.acceptTerms && <p className="text-xs text-red-500 mt-1">{errors.acceptTerms.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white rounded-md py-2 font-medium hover:bg-blue-600"
        >
          {isSubmitting ? 'Submitting…' : 'Sign Up'}
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

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Sign in
          </span>
        </p>
      </form>
    </div>
  );
}

export default Signup;
