import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  InputLabel,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  AccountCircle,
  Email as EmailIcon,
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  Description as FileIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  age: yup.number().typeError('Age must be a number').positive().integer().nullable(),
  country: yup.string().nullable(),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Min 8 characters').required('Password is required'),
  confirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required(),
  userType: yup.string().oneOf(['jobseeker', 'employer']).required('Select a role'),
  companyCard: yup.mixed().nullable(),
});

function Signup() {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { userType: 'jobseeker' },
  });

  const userType = watch('userType');
  const [fileName, setFileName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

const onSubmit = async (data) => {
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'confirm') formData.append(key, value);
    });
    if (data.companyCard?.[0]) {
      formData.append('companyCard', data.companyCard[0]);
    }

    const res = await axios.post('/auth/signup', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // if we're here, the request went through
    if (res.status === 201) {
      enqueueSnackbar(res.data?.message || 'Signup successful!', { variant: 'success' });
      setTimeout(() => {
        navigate('/verify-email', { state: { email: data.email } });
      }, 1000);
    } else {
      enqueueSnackbar(res.data?.message || 'Signup failed', { variant: 'error' });
    }
  } catch (err) {
    console.error('Signup Error:', err); // ✅ log for dev visibility

    const msg = err?.response?.data?.message
      || (err.request ? 'Network Error: Could not reach server.' : 'Unexpected error');

    enqueueSnackbar(msg, { variant: 'error' });
  }
};


  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register New User
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Full Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="age"
                control={control}
                render={({ field }) => (
                  <TextField label="Age" error={!!errors.age} helperText={errors.age?.message} fullWidth {...field} />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Country"
                    error={!!errors.country}
                    helperText={errors.country?.message}
                    fullWidth
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="confirm"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Confirm Password"
                    type={showConfirm ? 'text' : 'password'}
                    error={!!errors.confirm}
                    helperText={errors.confirm?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirm((prev) => !prev)} edge="end">
                            {showConfirm ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel sx={{ mb: 1 }}>Registering as</InputLabel>
              <Controller
                name="userType"
                control={control}
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <FormControlLabel value="jobseeker" control={<Radio />} label="Job Seeker" />
                    <FormControlLabel value="employer" control={<Radio />} label="Employer" />
                  </RadioGroup>
                )}
              />
              {errors.userType && (
                <Typography variant="caption" color="error">
                  {errors.userType.message}
                </Typography>
              )}
            </Grid>
            {userType === 'employer' && (
              <Grid item xs={12}>
                <Controller
                  name="companyCard"
                  control={control}
                  rules={{ required: 'Company card image is required' }}
                  render={({ field }) => (
                    <>
                      <Button component="label" variant="outlined" fullWidth sx={{ height: 56 }}>
                        <FileIcon sx={{ mr: 1 }} />
                        {fileName || 'Upload Company ID (JPEG/PNG)'}
                        <input
                          hidden
                          accept="image/jpeg,image/png"
                          type="file"
                          onChange={(e) => {
                            field.onChange(e.target.files);
                            setFileName(e.target.files?.[0]?.name || '');
                          }}
                        />
                      </Button>
                      {errors.companyCard && (
                        <Typography variant="caption" color="error">
                          {errors.companyCard.message}
                        </Typography>
                      )}
                    </>
                  )}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isSubmitting ? 'Submitting…' : 'Create Account'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default Signup;
