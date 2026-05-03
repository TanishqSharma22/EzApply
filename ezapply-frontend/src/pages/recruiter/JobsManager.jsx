import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const statusColors = {
  open:   'bg-green-50 text-green-700 border-green-200',
  closed: 'bg-gray-100 text-gray-600 border-gray-200',
  draft:  'bg-yellow-50 text-yellow-700 border-yellow-200',
};

const JobsManager = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/jobs');
        setJobs(res.data.data.jobs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleDelete = async (jobId) => {
    if (!confirm('Delete this job posting?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter((j) => j.id !== jobId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job.');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Job Postings</h1>
        <Link to="/recruiter/jobs/new"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
          + Post New Job
        </Link>
      </div>
      {jobs.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          No jobs posted yet.{' '}
          <Link to="/recruiter/jobs/new" className="text-blue-600 hover:underline">Post your first job</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-gray-800">{job.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">{job.company} · {job.location || 'Remote'}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full border font-medium ${statusColors[job.status]}`}>
                  {job.status}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button onClick={() => navigate(`/recruiter/jobs/${job.id}/applications`)}
                  className="text-sm text-blue-600 hover:underline">View Applications</button>
                <span className="text-gray-300">|</span>
                <button onClick={() => handleDelete(job.id)}
                  className="text-sm text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsManager;
