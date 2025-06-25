import React, { useState } from 'react';
import axios from '../api/axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); 
  // type: 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await axios.post('/auth/forgot-password', { email });
      setMessage({
        text: res.data.message || 'Reset link sent!',
        type: 'success',
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send reset link';
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
      <h1 className="text-xl font-bold text-center mb-2">Forgot Password</h1>
      <p className="text-sm text-gray-600 text-center mb-4">
        Enter your email to receive a password reset link.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 text-sm"
          />
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
              Sending...
            </span>
          ) : (
            'Send Reset Link'
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

export default ForgotPassword;
