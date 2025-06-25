import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Container, Paper, Button } from '@mui/material';
import axios from '../api/axios';
import { useLocation, useNavigate } from 'react-router-dom';


function VerifyEmail() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('Verifying your email...');
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    console.log("🔍 Token from URL:", token); // Debug token from URL


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
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        {status === 'loading' ? (
          <Box>
            <CircularProgress />
            <Typography variant="body1" sx={{ mt: 2 }}>{message}</Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="h5" sx={{ mb: 2 }} color={status === 'success' ? 'primary' : 'error'}>
              {status === 'success' ? '✅ Verified' : '❌ Error'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>{message}</Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              color={status === 'success' ? 'primary' : 'error'}
            >
              Go to Login
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}


export default VerifyEmail;