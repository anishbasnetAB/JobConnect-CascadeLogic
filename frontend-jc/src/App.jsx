// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';

import Signup from './Pages/Signup';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';

import ForgotPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';

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
