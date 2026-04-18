import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LangProvider } from './context/LangContext';

import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Functions from './pages/Functions';
import Contributions from './pages/Contributions';
import CreateFunction from './pages/CreateFunction';
import EntryWorkspace from './pages/EntryWorkspace';
import SummaryReports from './pages/SummaryReports';
import Profile from './pages/Profile';
import Legal from './pages/Legal';

function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center">
        <div className="font-headline text-primary tracking-[0.4em] text-sm uppercase animate-pulse mb-4">MOI Ledger</div>
        <div className="w-24 h-0.5 gold-gradient mx-auto animate-pulse" />
      </div>
    </div>
  );
  return token ? children : <Navigate to="/signin" replace />;
}

function PublicRoute({ children }) {
  const { token } = useAuth();
  return token ? <Navigate to="/dashboard" replace /> : children;
}

const toastStyle = {
  style: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '11px',
    letterSpacing: '0.05em',
    background: '#FDFCF0',
    color: '#2C241E',
    border: '1px solid #E5DCC3',
    borderRadius: '0',
    boxShadow: '0 8px 24px rgba(74,55,40,0.12)',
  },
  success: { iconTheme: { primary: '#C5A059', secondary: '#FDFCF0' } },
  error: { iconTheme: { primary: '#93000A', secondary: '#FDFCF0' } },
};

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={toastStyle} />
          <Routes>
            <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
            <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/functions" element={<PrivateRoute><Functions /></PrivateRoute>} />
            <Route path="/functions/new" element={<PrivateRoute><CreateFunction /></PrivateRoute>} />
            <Route path="/contributions/:id" element={<PrivateRoute><EntryWorkspace /></PrivateRoute>} />
            <Route path="/contributions" element={<PrivateRoute><Contributions /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><SummaryReports /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LangProvider>
  );
}
