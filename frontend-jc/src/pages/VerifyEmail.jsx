import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useLocation, useNavigate } from 'react-router-dom';

function VerifyEmail() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('Verifying your email...');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    console.log("🔍 Token from URL:", token);

    if (!token) {
      setStatus('error');
      setMessage('Verification token missing.');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await axios.get(`/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage(res.data?.message || 'Email verified successfully!');
      } catch (err) {
        console.error(err);
        const errorMsg = err.response?.data?.message?.toLowerCase() || '';
        if (errorMsg.includes('already verified')) {
          setStatus('success');
          setMessage('Your email was already verified. You can now log in.');
        } else {
          setStatus('error');
          setMessage('Invalid or expired verification token.');
        }
      }
    };

    verifyToken();
  }, [location.search]);

  return (
    <div className="max-w-md mx-auto mt-20 bg-white shadow rounded p-6 text-center">
      {status === 'loading' ? (
        <div>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-sm text-gray-700">{message}</p>
        </div>
      ) : (
        <div>
          <h2
            className={`text-xl font-bold mb-2 ${
              status === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {status === 'success' ? '✅ Verified' : '❌ Error'}
          </h2>
          <p className="mb-4 text-sm text-gray-700">{message}</p>
          <button
            onClick={() => navigate('/login')}
            className={`w-full py-2 rounded ${
              status === 'success'
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;
