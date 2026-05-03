import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const statusColors = {
  submitted:    'bg-yellow-50 text-yellow-700 border-yellow-200',
  under_review: 'bg-blue-50 text-blue-700 border-blue-200',
  shortlisted:  'bg-green-50 text-green-700 border-green-200',
  rejected:     'bg-red-50 text-red-700 border-red-200',
  hired:        'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/applications');
        setApplications(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Applications ({applications.length})</h1>
        <Link to="/seeker/dashboard"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700">
          Dashboard
        </Link>
      </div>
      {applications.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          No applications yet. <Link to="/seeker/jobs" className="text-blue-600 hover:underline">Find jobs</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link to={`/seeker/jobs/${app.job_id}`} className="font-semibold text-gray-800 hover:text-blue-600">
                    {app.job_title}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">{app.company} · {app.location || 'Remote'}</p>
                  {app.cover_letter && (
                    <p className="text-sm text-gray-600 mt-3 bg-gray-50 rounded-lg p-3 line-clamp-2">
                      {app.cover_letter}
                    </p>
                  )}
                </div>
                <span className={`text-xs px-3 py-1 rounded-full border font-medium ml-4 mt-1 ${statusColors[app.status]}`}>
                  {app.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                Applied {new Date(app.applied_at).toLocaleDateString()}
                {app.updated_at && app.updated_at !== app.applied_at && (
                  <> · Updated {new Date(app.updated_at).toLocaleDateString()}</>
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
