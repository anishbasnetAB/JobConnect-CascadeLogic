import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
  Link
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useAuth } from '../context/AuthContext'; // ✅ make sure this path is correct


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
  const navigate = useNavigate();
const { enqueueSnackbar } = useSnackbar();
  const { login } = useAuth(); // ✅ context login


  const onSubmit = async (data) => {
    try {
      const res = await axios.post('/auth/login', data);


      const user = res.data.user;


      // ✅ Save token and user
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(user));
      login(user); // update context


      enqueueSnackbar(res.data.message || 'Login successful', { variant: 'success' });


      if (user?.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      enqueueSnackbar(msg, { variant: 'error' });
    }
  };


  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login to Job Connect
        </Typography>


        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  )
                }}
                {...field}
              />
            )}
          />


          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                {...field}
              />
            )}
          />


          <Box mt={1} mb={2} textAlign="right">
            <Link href="/forgot-password" underline="hover">
              Forgot Password?
            </Link>
          </Box>


          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}


export default Login;
