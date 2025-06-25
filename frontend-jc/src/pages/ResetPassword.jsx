import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); 
  // type: 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await axios.post(`/auth/reset-password/${token}`, { newPassword: password });
      setMessage({
        text: res.data.message || 'Password reset successful!',
        type: 'success',
      });
      setTimeout(() => navigate('/login'), 2000); // Delay to let user see message
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password';
      setMessage({
        text: msg,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xs mx-auto mt-20 bg-white shadow rounded p-6">
      <h1 className="text-xl font-bold text-center mb-4">Reset Your Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded p-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <span className="flex justify-center items-center gap-2">
              <span className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></span>
              Resetting...
            </span>
          ) : (
            'Reset Password'
          )}
        </button>

        {message.text && (
          <div
            className={`text-center text-sm font-medium py-2 rounded ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}

export default ResetPassword;
