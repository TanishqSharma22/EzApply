import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const NewJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', company: '', location: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/jobs', form);
      navigate('/recruiter/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <button onClick={() => navigate('/recruiter/jobs')}
        className="text-sm text-gray-500 hover:text-blue-600 mb-6">← Back to My Jobs</button>
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Post a New Job</h1>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'title',    label: 'Job Title',  placeholder: 'e.g. Backend Engineer' },
            { name: 'company',  label: 'Company',    placeholder: 'e.g. TechCorp' },
            { name: 'location', label: 'Location',   placeholder: 'e.g. Remote, New York' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input type="text" name={field.name} value={form[field.name]} onChange={handleChange}
                required={field.name !== 'location'} placeholder={field.placeholder}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              required rows={6} placeholder="Describe the role, requirements, and responsibilities..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition">
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewJob;
