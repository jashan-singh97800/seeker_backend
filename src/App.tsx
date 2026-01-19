import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobSearchPage from './pages/JobSearchPage';
import UserProfilePage from './pages/UserProfilePage';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import AdminPanel from './pages/AdminPanel';
import RequireAuth from './features/auth/RequireAuth';
import GoogleCallback from './pages/GoogleCallback';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="search" element={<JobSearchPage />} />
        <Route path="google-callback" element={<GoogleCallback />} />

        {/* Protected Routes */}
        <Route element={<RequireAuth allowedRoles={['job_seeker']} />}>
          <Route path="dashboard" element={<JobSeekerDashboard />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={['employer']} />}>
          <Route path="employer" element={<EmployerDashboard />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={['admin']} />}>
          <Route path="admin" element={<AdminPanel />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={['job_seeker', 'employer', 'admin']} />}>
          <Route path="profile" element={<UserProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
