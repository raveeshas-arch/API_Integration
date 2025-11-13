import { Routes, Route, Navigate } from 'react-router';
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Manual from './pages/Manual';
import API from './pages/API';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import { Layout } from './components/Layout/Navigation';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has token (simple localStorage check)
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider defaultTheme="light">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="light">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/manual" element={<Manual />} />
          <Route path="/api" element={<API />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App;