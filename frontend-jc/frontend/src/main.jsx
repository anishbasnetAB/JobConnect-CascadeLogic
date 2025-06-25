// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import App from './App.jsx';
import Navbar from './pages/Navbar.jsx'; // ✅ Ensure correct path
import AuthProvider from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <App />
        </BrowserRouter>
      </AuthProvider>
    </SnackbarProvider>
  </StrictMode>
);
