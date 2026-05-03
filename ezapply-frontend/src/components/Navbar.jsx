import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-blue-600">EzApply</Link>
      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Get Started</Link>
          </>
        ) : (
          <>
            <span className="text-sm text-gray-500">{user.full_name} · {user.role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}</span>
            {user.role === 'job_seeker' && (
              <>
                <Link to="/jobs" className="text-gray-600 hover:text-blue-600">Browse Jobs</Link>
                <Link to="/my-applications" className="text-gray-600 hover:text-blue-600">My Applications</Link>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
              </>
            )}
            {user.role === 'recruiter' && (
              <>
                <Link to="/recruiter/jobs" className="text-gray-600 hover:text-blue-600">My Jobs</Link>
                <Link to="/recruiter/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
              </>
            )}
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 text-sm">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
