import { Routes, Route } from 'react-router';
import Dashboard from './pages/Dashboard';
import Manual from './pages/Manual';
import API from './pages/API';
import { ROUTES } from './constants/routes.constant';
import { Layout } from './components/Layout/Navigation';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.MANUAL} element={<Manual />} />
        <Route path={ROUTES.API} element={<API />} />
      </Routes>
    </Layout>
  );
}

export default App;
