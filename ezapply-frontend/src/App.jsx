import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import SeekerDashboard from './pages/seeker/Dashboard';
import JobsList from './pages/seeker/JobsList';
import JobDetail from './pages/seeker/JobDetail';
import MyApplications from './pages/seeker/MyApplications';
import RecruiterDashboard from './pages/recruiter/Dashboard';
import JobsManager from './pages/recruiter/JobsManager';
import NewJob from './pages/recruiter/NewJob';
import JobApplications from './pages/recruiter/JobApplications';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<RoleRoute role="job_seeker"><SeekerDashboard /></RoleRoute>} />
            <Route path="/jobs" element={<ProtectedRoute><JobsList /></ProtectedRoute>} />
            <Route path="/jobs/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
            <Route path="/my-applications" element={<RoleRoute role="job_seeker"><MyApplications /></RoleRoute>} />
            <Route path="/recruiter/dashboard" element={<RoleRoute role="recruiter"><RecruiterDashboard /></RoleRoute>} />
            <Route path="/recruiter/jobs" element={<RoleRoute role="recruiter"><JobsManager /></RoleRoute>} />
            <Route path="/recruiter/jobs/new" element={<RoleRoute role="recruiter"><NewJob /></RoleRoute>} />
            <Route path="/recruiter/jobs/:id/applications" element={<RoleRoute role="recruiter"><JobApplications /></RoleRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
