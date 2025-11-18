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

  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:3001/auth/verify", {
        credentials: "include",
      });
      return res.status === 200;
    } catch (error) {
      
      return false;
    }
  };

  // Initial auth check
  useEffect(() => {
    const verify = async () => {
      const valid = await checkAuth();
      setIsAuthenticated(valid);
      setLoading(false);
    };

    verify();
  }, []);

  // Interval to detect manual cookie deletion
  useEffect(() => {
    if (!isAuthenticated) return; 

    const interval = setInterval(async () => {
      const valid = await checkAuth();

      if (!valid && isAuthenticated) {
        setIsAuthenticated(false);
      }
    }, 5000); 

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
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
      <Layout isAuthenticated={isAuthenticated}>
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