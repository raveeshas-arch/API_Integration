import { Routes, Route } from 'react-router';
import Dashboard from './pages/Dashboard';
import Manual from './pages/Manual';
import API from './pages/API';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import { Layout } from './components/Layout/Navigation';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/*" element={
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/manual" element={<Manual />} />
            <Route path="/api" element={<API />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  );
}

export default App;