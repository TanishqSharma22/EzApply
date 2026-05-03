import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [appLoading, setAppLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [jobRes, appRes] = await Promise.all([
          api.get(`/jobs/${id}`),
          api.get(`/applications/status/${id}`),
        ]);
        setJob(jobRes.data.data);
        if (appRes.data.exists) setApplied(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!coverLetter.trim()) {
      setError('Cover letter is required.');
      return;
    }
    setError('');
    setAppLoading(true);
    try {
      await api.post('/applications', { job_id: id, cover_letter: coverLetter });
      setApplied(true);
      setCoverLetter('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply.');
    } finally {
      setAppLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (!job) return <div className="text-center py-20 text-gray-400">Job not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <button onClick={() => navigate('/seeker/jobs')} 
        className="text-sm text-gray-500 hover:text-blue-600 mb-6">← All Jobs</button>
      
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{job.company} · {job.location || 'Remote'}</p>
            <div className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${statusColors[job.status]}`}>
              {job.status}
            </div>
          </div>
        </div>
        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: job.description }} />
      </div>

      {applied ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="text-green-700 text-lg font-medium">✓ Application Submitted</div>
          <p className="text-green-600 mt-1 text-sm">We'll notify you if shortlisted.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Apply for this Job</h2>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
          )}
          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter (Optional but recommended)</label>
              <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)}
                rows={6} placeholder="Tell us why you're perfect for this role, your relevant experience, and what excites you about this position..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" disabled={appLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition">
              {appLoading ? 'Applying...' : 'Apply Now'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
