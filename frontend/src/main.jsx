// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { SnackbarProvider } from 'notistack';
import AuthProvider from './context/AuthContext.jsx'; // ✅ Make sure this exists

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </SnackbarProvider>
  </StrictMode>
);
