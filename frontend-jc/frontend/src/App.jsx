// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

import Signup from './pages/Signup';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import PostJob from './pages/Employer/PostJob';
import MyJobs from './pages/Employer/MyJobs';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
         <Route
        path="/employer/my-jobs"
        element={
          <ProtectedRoute>
            <MyJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employer/my-jobs"
        element={
          <ProtectedRoute>
            <MyJobs />
          </ProtectedRoute>
        }
      />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
