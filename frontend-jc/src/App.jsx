// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';

import Signup from './Pages/Signup';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import EmployerDashboard from './pages/Employer/Dashboard';
import ProtectedRoute from './utils/ProtectedRoute';
import ForgotPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import PostJob from './pages/Employer/PostJob';
import MyJobs from './pages/Employer/MyJobs';
import EditJob from './pages/Employer/EditJob';
import ViewApplicants from './pages/Employer/ViewApplicants';
import ApplyJob from './pages/Jobseeker/ApplyJob';
import JobDetail from './pages/Jobseeker/JobDetail';
import JobList from './pages/Jobseeker/JobList';
import SavedJobs from './pages/Jobseeker/SavedJobs';
import MyApplications from './pages/Jobseeker/MyApplications';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" replace />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;
