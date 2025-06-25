import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required')
});

function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('/auth/login', data);
      const user = res.data.user;

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(user));
      login(user);

      setMessage({ text: res.data.message || 'Login successful', type: 'success' });

      setTimeout(() => {
        if (user?.role === 'employer') {
          navigate('/employer/dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setMessage({ text: msg, type: 'error' });
    }
  };

  return (
    <div className="max-w-xs mx-auto mt-20 bg-white shadow rounded p-6">
      <h1 className="text-xl font-bold text-center mb-2">Login to Job Connect</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                type="email"
                {...field}
                className={`w-full border rounded p-2 text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
            )}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...field}
                  className={`w-full border rounded p-2 text-sm pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <div className="text-right">
          <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <span className="flex justify-center items-center gap-2">
              <span className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></span>
              Logging in...
            </span>
          ) : (
            'Login'
          )}
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

export default Login;
