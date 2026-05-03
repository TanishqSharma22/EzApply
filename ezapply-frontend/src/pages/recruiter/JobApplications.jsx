import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const statusOptions = ['under_review', 'shortlisted', 'rejected', 'hired'];
const statusColors = {
  submitted:    'bg-gray-100 text-gray-600',
  under_review: 'bg-yellow-50 text-yellow-700',
  shortlisted:  'bg-blue-50 text-blue-700',
  rejected:     'bg-red-50 text-red-600',
  hired:        'bg-green-50 text-green-700',
};

const JobApplications = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/applications/job/${id}`);
        setApplications(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdating(applicationId);
    try {
      await api.patch(`/applications/${applicationId}/status`, { status: newStatus });
      setApplications(applications.map((app) =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <button onClick={() => navigate('/recruiter/jobs')}
        className="text-sm text-gray-500 hover:text-blue-600 mb-6">← Back to My Jobs</button>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Applications ({applications.length})</h1>
      {applications.length === 0 ? (
        <div className="text-center text-gray-400 py-20">No applications yet.</div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-gray-800">{app.applicant_name}</h2>
                  <p className="text-sm text-gray-500">{app.applicant_email}</p>
                  {app.cover_letter && (
                    <p className="text-sm text-gray-600 mt-3 bg-gray-50 rounded-lg p-3">{app.cover_letter}</p>
                  )}
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[app.status]}`}>
                  {app.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <span className="text-xs text-gray-400">Update status:</span>
                {statusOptions.map((s) => (
                  <button key={s} onClick={() => handleStatusChange(app.id, s)}
                    disabled={app.status === s || updating === app.id}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition disabled:opacity-40 ${
                      app.status === s
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                    }`}>
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">Applied {new Date(app.applied_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplications;
